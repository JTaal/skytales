---
layout: post
title: "Visualizing Regularisation in 3D with Ridge and Lasso"
date: 2025-09-14
visualization_url: /visualizations/regularisation.html
categories: [Machine Learning, Visualization]
tags: [Regularisation, Ridge, Lasso, Three.js, TailwindCSS]
description: Explanation of fundamental regularisation techniques
# permalink: /blog/:year/:month/:day/:title/
---

## Introduction  
Regularisation is one of the most powerful techniques in machine learning to combat **overfitting** and improve **generalization**.  
Instead of keeping it abstract, this post introduces an **interactive 3D Regularisation Visualizer** built with Three.js and TailwindCSS.  

---

## What is Regularisation?  

When fitting a model, we usually solve:  

$$
\hat{\beta} = \arg \min_{\beta} \ \|y - X\beta\|_2^2
$$

The issue? With too many features or high-degree polynomials, the model can **overfit** noise.  

Regularisation adds a penalty:  

- **Ridge (L2):**  
$$
\hat{\beta} = \arg \min_{\beta} \ \|y - X\beta\|_2^2 + \lambda \|\beta\|_2^2
$$  

- **Lasso (L1):**  
$$
\hat{\beta} = \arg \min_{\beta} \ \|y - X\beta\|_2^2 + \lambda \|\beta\|_1
$$  

Here, \( \lambda \) controls the penalty strength.  

---

## The Interactive Demo  

The visualizer lets you:  

- Adjust the **polynomial degree** of the model  
- Switch between **Ridge, Lasso, and OLS (no penalty)**  
- Control **λ (penalty strength)** dynamically  
- Add **Gaussian-distributed data** with custom mean, variance, and correlation  
- Display **covariance matrices, determinants, and bias terms**  
- Toggle **2D/3D views, mesh styles, and penalty constraints**  

---

## Features in Action  

- **Data Distributions:** Multiple Gaussians show how variance and correlation shape covariance.  
- **Penalty Geometry:**  
  - L1 → Octahedron (diamond constraint)  
  - L2 → Sphere (circular constraint)  
- **Hit Point:** Highlights where the regression solution collides with the penalty boundary.  
- **Metrics Panel:** Displays bias, covariance, and determinant in real time.  

---

## Formulas  

- **Covariance Matrix:**  

$$
\Sigma = 
\begin{bmatrix}
\sigma_x^2 & \rho \sigma_x \sigma_y \\
\rho \sigma_x \sigma_y & \sigma_y^2
\end{bmatrix}
$$

- **Determinant:**  

$$
|\Sigma| = \sigma_x^2 \sigma_y^2 - (\rho \sigma_x \sigma_y)^2
$$

- **Ridge Normal Equation:**  

$$
\hat{\beta} = (X^T X + \lambda I)^{-1} X^T y
$$

## Conclusion  

The **Regularisation Visualizer** bridges math and intuition. It shows how Ridge and Lasso reshape solution spaces, revealing the trade-offs between **bias, variance, and sparsity**.  
Whether for teaching, experimenting, or exploring, it’s a powerful way to make abstract equations **come alive in 3D**.
