import tkinter as tk
from tkinter import filedialog, Scale, Label, Button, ttk
from PIL import Image, ImageTk
import cv2
import collections
import os
from tqdm import tqdm
from moviepy.editor import VideoFileClip
import threading

class VideoMotionExtractor:
    def __init__(self, root):
        self.root = root
        self.root.title("Motion Extraction with Time Delay")
        self.root.geometry("800x600")
        self.root.configure(bg="#2E2E2E")

        # --- Video and Frame Storage ---
        self.video_path = None
        self.cap = None
        self.fps = 30
        self.width = 1920
        self.height = 1080
        self.frame_buffer = collections.deque()
        self.paused = True # Start paused until a video is loaded

        # --- GUI Setup ---
        self.style = ttk.Style()
        self.style.theme_use('clam')
        self.style.configure('.', background='#2E2E2E', foreground='#E0E0E0', font=('Arial', 10))
        self.style.configure('TButton', background='#4A4A4A', foreground='#E0E0E0', borderwidth=1)
        self.style.map('TButton', background=[('active', '#606060')])
        self.style.configure('TScale', background='#2E2E2E', troughcolor='#555555')
        self.style.configure('TLabel', background='#2E2E2E', foreground='#E0E0E0')

        self.main_canvas = Label(root, bg="#1C1C1C")
        self.main_canvas.pack(pady=10, padx=10, fill=tk.BOTH, expand=True)

        self.delay_label = ttk.Label(root, text="Frame Delay: 10 frames")
        self.delay_label.pack(pady=(5, 0))
        self.delay_slider = ttk.Scale(root, from_=0, to=100, orient=tk.HORIZONTAL, command=self.update_delay_label)
        self.delay_slider.set(10)
        self.delay_slider.pack(fill=tk.X, padx=10, pady=(0, 10))

        controls_frame = ttk.Frame(root)
        controls_frame.pack(pady=5)
        self.load_button = ttk.Button(controls_frame, text="Load Video", command=self.load_video)
        self.load_button.pack(side=tk.LEFT, padx=5)
        self.play_pause_button = ttk.Button(controls_frame, text="Play", command=self.toggle_pause)
        self.play_pause_button.pack(side=tk.LEFT, padx=5)
        self.save_button = ttk.Button(controls_frame, text="Render and Save", command=self.start_render_process)
        self.save_button.pack(side=tk.LEFT, padx=5)

        # --- Subcomponent Windows (will be destroyed with root) ---
        self.win1 = tk.Toplevel(root)
        self.win1.title("Video 1 (Delayed)")
        self.win1.geometry("640x360")
        self.win1.configure(bg="#2E2E2E")
        self.canvas1 = Label(self.win1, bg="#1C1C1C")
        self.canvas1.pack(fill=tk.BOTH, expand=True)

        self.win2 = tk.Toplevel(root)
        self.win2.title("Video 2 (Current)")
        self.win2.geometry("640x360")
        self.win2.configure(bg="#2E2E2E")
        self.canvas2 = Label(self.win2, bg="#1C1C1C")
        self.canvas2.pack(fill=tk.BOTH, expand=True)

        self.load_video()

    def load_video(self):
        if self.cap:
            self.cap.release()
            self.frame_buffer.clear()

        self.video_path = filedialog.askopenfilename(title="Select a video file")
        if not self.video_path:
            self.paused = True
            self.play_pause_button.config(text="Play")
            return

        self.cap = cv2.VideoCapture(self.video_path)
        if not self.cap.isOpened():
            print("Error: Could not open video file.")
            self.video_path = None
            return

        self.fps = self.cap.get(cv2.CAP_PROP_FPS)
        self.width = int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        self.height = int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        total_frames = int(self.cap.get(cv2.CAP_PROP_FRAME_COUNT))

        max_delay = min(total_frames // 2, 300)
        self.delay_slider.config(to=max_delay)
        if self.delay_slider.get() > max_delay:
            self.delay_slider.set(max_delay // 2)

        self.paused = False
        self.play_pause_button.config(text="Pause")
        self.update_frame()

    def update_delay_label(self, val):
        self.delay_label.config(text=f"Frame Delay: {int(float(val))} frames")

    def toggle_pause(self):
        self.paused = not self.paused
        if self.paused:
            self.play_pause_button.config(text="Play")
        else:
            self.play_pause_button.config(text="Pause")
            self.update_frame()

    def update_frame(self):
        if self.paused or not self.cap or not self.cap.isOpened():
            return

        delay = int(self.delay_slider.get())
        ret_current, frame_current = self.cap.read()

        if not ret_current:
            self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret_current, frame_current = self.cap.read()
            if not ret_current: return

        self.frame_buffer.append(frame_current.copy())

        if len(self.frame_buffer) > delay:
            frame_delayed = self.frame_buffer.popleft()
            overlay_frame = cv2.addWeighted(frame_delayed, 0.5, frame_current, 0.5, 0)
            self.display_image(overlay_frame, self.main_canvas, 1920, 1080)
            self.display_image(frame_delayed, self.canvas1, 640, 360)
            self.display_image(frame_current, self.canvas2, 640, 360)

        self.root.after(int(1000 / self.fps), self.update_frame)

    def display_image(self, frame, canvas, target_width, target_height):
        if frame is None: return
        h, w = frame.shape[:2]
        aspect_ratio = w / h

        if w > target_width or h > target_height:
            if w / target_width > h / target_height:
                new_w, new_h = target_width, int(target_width / aspect_ratio)
            else:
                new_h, new_w = target_height, int(target_height * aspect_ratio)
            frame = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_AREA)

        cv2image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        img = Image.fromarray(cv2image)
        imgtk = ImageTk.PhotoImage(image=img)
        canvas.imgtk = imgtk
        canvas.configure(image=imgtk)

    def start_render_process(self):
        """Prepares and starts the rendering in a separate thread, then closes the UI."""
        if not self.video_path:
            print("No video loaded to render.")
            return

        output_dir = os.path.join(os.path.dirname(self.video_path), "motion-extracted")
        os.makedirs(output_dir, exist_ok=True)
        output_filepath = os.path.join(output_dir, "motion-extracted.mp4")
        delay = int(self.delay_slider.get())

        print("UI is closing. Rendering will begin in the console.")
        
        render_thread = threading.Thread(
            target=self._render_video_thread,
            args=(self.video_path, delay, output_filepath, self.fps, self.width, self.height)
        )
        render_thread.start()
        self.root.destroy()

    def _render_video_thread(self, video_path, delay, output_filepath, fps, width, height):
        """The actual rendering logic that runs in a separate thread."""
        print(f"Rendering video to: {output_filepath}")
        
        render_cap = cv2.VideoCapture(video_path)
        if not render_cap.isOpened():
            print("Error: Could not open video for rendering.")
            return

        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_filepath, fourcc, fps, (width, height))

        total_frames = int(render_cap.get(cv2.CAP_PROP_FRAME_COUNT))
        render_buffer = collections.deque()

        # --- THIS IS THE CORRECTED LINE ---
        for _ in tqdm(range(total_frames), desc="Rendering Video", unit="frames", ncols=100):
            ret, frame = render_cap.read()
            if not ret: break

            render_buffer.append(frame.copy())

            if len(render_buffer) > delay:
                frame_delayed = render_buffer.popleft()
                overlay_frame = cv2.addWeighted(frame_delayed, 0.5, frame, 0.5, 0)
                out.write(overlay_frame)
            else:
                out.write(frame)

        render_cap.release()
        out.release()
        print(f"\nRendering complete: {output_filepath}")

        try:
            print("Stripping metadata...")
            clip = VideoFileClip(output_filepath)
            temp_output_path = os.path.join(os.path.dirname(output_filepath), "temp_video.mp4")
            clip.write_videofile(temp_output_path, codec='libx264', remove_temp=True,
                                 logger=None, audio_codec='aac')
            clip.close()
            os.replace(temp_output_path, output_filepath)
            print("Metadata stripped successfully.")
        except Exception as e:
            print(f"Could not strip metadata: {e}")
            print("The rendered video is still available but may contain metadata.")
        
        print("\nProcess finished.")

if __name__ == "__main__":
    root = tk.Tk()
    app = VideoMotionExtractor(root)
    root.mainloop()
