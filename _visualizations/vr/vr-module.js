import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { XRHandModelFactory } from 'three/examples/jsm/webxr/XRHandModelFactory.js';

/**
 * Manages all WebXR/VR functionality, including session management,
 * controller setup, and input handling.
 */
class VRManager {
    /**
     * @param {object} config - The configuration object.
     * @param {THREE.WebGLRenderer} config.renderer - The main Three.js renderer.
     * @param {THREE.PerspectiveCamera} config.camera - The main Three.js camera.
     * @param {HTMLElement} config.vrButton - The button element to toggle VR sessions.
     * @param {OrbitControls} config.controls - The OrbitControls instance for mouse interaction.
     */
    constructor({ renderer, camera, vrButton, controls }) {
        this.renderer = renderer;
        this.camera = camera;
        this.vrButton = vrButton;
        this.controls = controls;

        // A "dolly" is an object that the camera is attached to.
        // In VR, we move the dolly around the scene, not the camera directly.
        this.playerDolly = new THREE.Group();
        this.playerDolly.add(this.camera);

        // State manager for controller inputs.
        this.inputs = {
            left: { grip: { pressed: false }, trigger: { pressed: false }, thumbstick: { x: 0, y: 0 } },
            right: { grip: { pressed: false }, trigger: { pressed: false }, thumbstick: { x: 0, y: 0 } },
            isZooming: false,
            initialZoomDistance: 0,
            initialDollyScale: new THREE.Vector3()
        };
        
        this.controller1 = null;
        this.controller2 = null;
        this.controllerGrip1 = null;
        this.controllerGrip2 = null;
        this.hand1 = null;
        this.hand2 = null;
        
        this._init();
    }
    
    /**
     * Checks for WebXR support and initializes session listeners and controllers.
     * @private
     */
    _init() {
        if ('xr' in navigator) {
            navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
                if (supported) {
                    this.vrButton.addEventListener('click', () => this.toggleSession());
                    this._setupSessionListeners();
                    this._setupControllers();
                } else {
                    this._disableVR('VR Not Supported');
                }
            });
        } else {
            this._disableVR('WebXR Not Available');
        }
    }

    /**
     * Disables the VR button and shows a message.
     * @private
     * @param {string} message - The message to display.
     */
    _disableVR(message) {
        this.vrButton.disabled = true;
        const span = this.vrButton.querySelector('span');
        if (span) span.textContent = message;
    }

    /**
     * Checks if a VR session is currently active.
     * @returns {boolean}
     */
    get isPresenting() {
        return this.renderer.xr.isPresenting;
    }

    /**
     * Starts or ends a VR session.
     */
    toggleSession() {
        if (this.isPresenting) {
            const session = this.renderer.xr.getSession();
            if (session) session.end().catch(err => console.error("Error ending session:", err));
        } else {
            const sessionInit = { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'] };
            navigator.xr.requestSession('immersive-vr', sessionInit).then((session) => {
                this.renderer.xr.setSession(session);
            }).catch(err => console.error("Error starting session:", err));
        }
    }

    /**
     * Sets up listeners for when the VR session starts and ends.
     * @private
     */
    _setupSessionListeners() {
        this.renderer.xr.addEventListener('sessionstart', () => {
            // When entering VR, move the dolly to the camera's current world position.
            this.playerDolly.position.copy(this.camera.position);
            this.playerDolly.quaternion.copy(this.camera.quaternion);
            // Reset the camera's position relative to the dolly.
            this.camera.position.set(0, 0, 0);
            this.camera.quaternion.identity();
            if (this.controls) this.controls.enabled = false;

            this.vrButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 12.3C2 7.8 5.8 4 10.3 4s8.3 3.8 8.3 8.3-3.5 8.3-8.3 8.3S2 16.8 2 12.3z"/>
                    <path d="M12.3 4a8.3 8.3 0 0 1 8.3 8.3 8.3 8.3 0 0 1-8.3 8.3"/>
                </svg>
                <span>Exit VR</span>
            `;
            this.vrButton.classList.add('active');
        });

        this.renderer.xr.addEventListener('sessionend', () => {
            // When exiting VR, move the camera back to where the dolly was.
            this.camera.position.copy(this.playerDolly.position);
            this.camera.scale.copy(this.playerDolly.scale);
            // Reset the dolly's position and scale for the next session.
            this.playerDolly.position.set(0, 0, 0);
            this.playerDolly.quaternion.identity();
            this.playerDolly.scale.set(1, 1, 1);
            if (this.controls) this.controls.enabled = true;

            this.vrButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                   <path d="M2 12.3C2 7.8 5.8 4 10.3 4s8.3 3.8 8.3 8.3-3.5 8.3-8.3 8.3S2 16.8 2 12.3z"/>
                   <path d="M12.3 4a8.3 8.3 0 0 1 8.3 8.3 8.3 8.3 0 0 1-8.3 8.3"/>
               </svg>
               <span>Enter VR</span>
            `;
            this.vrButton.classList.remove('active');
        });
    }

    /**
     * Creates and configures the VR controllers and hand models.
     * @private
     */
    _setupControllers() {
        const controllerModelFactory = new XRControllerModelFactory();
        const handModelFactory = new XRHandModelFactory();

        // Controller 1 (typically left)
        this.controller1 = this.renderer.xr.getController(0);
        this.playerDolly.add(this.controller1);
        this.controllerGrip1 = this.renderer.xr.getControllerGrip(0);
        this.controllerGrip1.add(controllerModelFactory.createControllerModel(this.controllerGrip1));
        this.playerDolly.add(this.controllerGrip1);
        this.hand1 = this.renderer.xr.getHand(0);
        this.hand1.add(handModelFactory.createHandModel(this.hand1));
        this.playerDolly.add(this.hand1);

        // Controller 2 (typically right)
        this.controller2 = this.renderer.xr.getController(1);
        this.playerDolly.add(this.controller2);
        this.controllerGrip2 = this.renderer.xr.getControllerGrip(1);
        this.controllerGrip2.add(controllerModelFactory.createControllerModel(this.controllerGrip2));
        this.playerDolly.add(this.controllerGrip2);
        this.hand2 = this.renderer.xr.getHand(1);
        this.hand2.add(handModelFactory.createHandModel(this.hand2));
        this.playerDolly.add(this.hand2);
    }
    
    /**
     * Polls the gamepad state for each controller on every frame.
     * @private
     */
    _updateInputs() {
        if (!this.isPresenting) return;

        const deadzone = 0.15;

        const updateControllerState = (controller, state) => {
            if (controller && controller.gamepad) {
                const gamepad = controller.gamepad;
                state.trigger.pressed = gamepad.buttons[0] && gamepad.buttons[0].pressed;
                state.grip.pressed = gamepad.buttons[1] && gamepad.buttons[1].pressed;
                state.thumbstick.x = Math.abs(gamepad.axes[2]) > deadzone ? gamepad.axes[2] : 0;
                state.thumbstick.y = Math.abs(gamepad.axes[3]) > deadzone ? gamepad.axes[3] : 0;
            }
        };

        updateControllerState(this.controller1, this.inputs.left);
        updateControllerState(this.controller2, this.inputs.right);
    }

    /**
     * Handles player movement, turning, and zooming based on controller inputs.
     * @private
     * @param {number} delta - Time since the last frame.
     */
    _handleControls(delta) {
        if (!this.isPresenting) return;

        const speed = 3.0;
        const turnSpeed = 1.5;

        // --- Movement (Left Thumbstick) ---
        const cameraDirection = this.camera.getWorldQuaternion(new THREE.Quaternion());
        const moveDirection = new THREE.Vector3(this.inputs.left.thumbstick.x, 0, this.inputs.left.thumbstick.y);

        if (moveDirection.length() > 0.1) {
            moveDirection.normalize().multiplyScalar(speed * delta);
            const flatCameraQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), new THREE.Euler().setFromQuaternion(cameraDirection).y);
            moveDirection.applyQuaternion(flatCameraQuaternion);
            this.playerDolly.position.add(moveDirection);
        }

        // --- Turning & Vertical (Right Thumbstick) ---
        if (Math.abs(this.inputs.right.thumbstick.x) > 0.1) {
             this.playerDolly.rotation.y -= this.inputs.right.thumbstick.x * turnSpeed * delta;
        }
        if (Math.abs(this.inputs.right.thumbstick.y) > 0.1) {
             this.playerDolly.position.y -= this.inputs.right.thumbstick.y * speed * delta;
        }
        
        // --- Grab and Pull Zoom (Both Grips) ---
        const bothGripsPressed = this.inputs.left.grip.pressed && this.inputs.right.grip.pressed;

        if (bothGripsPressed && !this.inputs.isZooming) {
            this.inputs.isZooming = true;
            this.inputs.initialZoomDistance = this.controllerGrip1.position.distanceTo(this.controllerGrip2.position);
            this.inputs.initialDollyScale.copy(this.playerDolly.scale);
        } else if (bothGripsPressed && this.inputs.isZooming) {
            const currentDistance = this.controllerGrip1.position.distanceTo(this.controllerGrip2.position);
            if (this.inputs.initialZoomDistance > 0.01) {
                const scaleFactor = currentDistance / this.inputs.initialZoomDistance;
                const newScale = this.inputs.initialDollyScale.clone().multiplyScalar(scaleFactor);
                newScale.clampScalar(0.1, 10.0);
                this.playerDolly.scale.copy(newScale);
            }
        } else if (!bothGripsPressed && this.inputs.isZooming) {
            this.inputs.isZooming = false;
        }
    }

    /**
     * Public method to be called in the main animation loop.
     * @param {number} delta - Time since the last frame.
     */
    update(delta) {
        this._updateInputs();
        this._handleControls(delta);
    }
}

export default VRManager;
