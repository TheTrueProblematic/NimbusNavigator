from diffusers import DiffusionPipeline
import torch

# Load the SDXL base model
pipeline = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16, use_safetensors=True)
pipeline = pipeline.to("mps")

# Optionally load the refiner model
refiner = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-xl-refiner-1.0", torch_dtype=torch.float16, use_safetensors=True)
refiner = refiner.to("mps")

# Generate an initial image with the base model
prompt = "A happy smiling children's cartoon liliac colored platypus on a rainy day with dark storm clouds above"
base_image = pipeline(prompt, num_inference_steps=50).images[0]

# Refine the image for higher detail
refined_image = refiner(prompt, image=base_image, num_inference_steps=20).images[0]

# Save the final image
refined_image.save("output_sdxl.png")
