---
title: "Best Open-Source AI Video Models You Can Actually Run (8–24GB VRAM)"
description: "Honest mid-2026 guide to local AI video: Wan 2.2, LTX-2.3, SkyReels-V2-VRAM tiers, ComfyUI setup, and when Runway/Veo still win."
type: guide
category: tools
tags: [ai, video, machine-learning, open-source, gpu]
keywords: [open source ai video, wan 2.2, local video generation, comfyui video, skyreels, 8gb vram video model]
publishedAt: 2026-07-03
updatedAt: 2026-07-03
author: ossium
featured: false
---

As of mid-2026, a consumer GPU can generate short video-roughly 5–20 seconds at 720p or 1080p depending on model and patience. Aggregator “best model” lists often mix versions, invent VRAM needs, and lead to OOM before frame one.

Strip the noise and three open families matter most for **desktop** work: **Wan**, **LTX**, and **SkyReels**-optimized for different jobs.

## Three models, three jobs

| Model | Best for | Notes |
|-------|----------|--------|
| **Wan 2.2 (TI2V-5B)** | Default local short clips | Apache 2.0; widest consumer fit |
| **LTX-2.3** | Speed + optional audio sync | ARR-based commercial terms; big VRAM for 4K |
| **SkyReels-V2 1.3B** | Longer clips (tens of seconds) | Diffusion Forcing; quality drift at 60s |

### Wan 2.2

Alibaba Tongyi Lab’s Wan 2.2 (July 2025 lineage) is the practical baseline. **Apache 2.0**-commercial use, modify, redistribute without surprise clauses for the open weights.

**`Wan2.2-TI2V-5B`** hybrid text-to-video / image-to-video is the checkpoint most desktop cards can run. Heavier A14B MoE variants need more than 24GB without aggressive quant/offload.

Reported ballpark: ~5s 720p under ~9 minutes on an RTX 4090 with proper flags (see README). Newer Wan major versions often target higher-end hardware; for consumer VRAM, **2.2 TI2V-5B** remains the safe pick.

### LTX-2.3

Lightricks’ LTX-2 series (2026): ~22B DiT-class stack with video + audio paths-**audio that syncs during the same pass**, unusual for open video.

NVFP8-quantized weights shrink footprint and speed vs bf16. Marketing claims high ceilings (4K / long clips); real 4K times need high-end cards. Commercial use is freer for smaller companies-**read the ARR-style license** (e.g. free research / commercial under revenue caps).

### SkyReels-V2

Skywork’s “infinite-length film” framing: **Diffusion Forcing** keeps per-frame noise schedules so length can grow without VRAM exploding like full-sequence diffusion.

README-scale frame counts: hundreds of frames for 10–30s, ~1457 frames for 60s-with real quality/physics drift at the long end. **1.3B** peaks ~14.7GB at 540p; **14B** is multi-40GB+ class.

## What eats VRAM

1. **Text encoder** (e.g. large T5) - can be multi-GB even quantized  
2. **DiT / diffusion blocks** - attention scales with frame count  
3. **VAE decode** - latents → pixels at the end  

Fitting a card is about not peaking all three at once-offload T5 to CPU, layer offload, FP8, shorter clips.

## Which card, which model

### 8GB (RTX 3060 8GB, 4060)

**Pick:** Wan 2.2 TI2V-5B + ComfyUI native offloading.

```bash
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
pip install-r requirements.txt

mkdir-p models/diffusion_models
huggingface-cli download Wan-AI/Wan2.2-TI2V-5B \
 --local-dir models/diffusion_models/wan2.2-ti2v-5b

python main.py--listen
```

Expect ~720p short clips; **10–15+ minutes** per clip is normal. Iteration is slow but possible.

### 12GB (3060 12GB, 4070)

Still **Wan 5B**, often with community FP8 workflows-less aggressive offload, faster than 8GB. LTX FP8 community paths exist; “native 12GB” docs are thin-experiment carefully.

### 16GB (4070 Ti Super, 4080)

Wan 5B at higher quality with less RAM thrash. **SkyReels-V2 1.3B** becomes realistic for long-form (~14.7GB peak at 540p). Short high-fidelity → Wan; multi-tens-of-seconds → SkyReels.

Scripted path (conceptual) with Diffusers + CPU offload:

```python
import torch
from diffusers import WanPipeline
from diffusers.utils import export_to_video

pipe = WanPipeline.from_pretrained(
    "Wan-AI/Wan2.2-TI2V-5B",
    torch_dtype=torch.bfloat16,
)
pipe.enable_model_cpu_offload()  # 8–16GB; on 24GB+ you may .to("cuda")

frames = pipe(
    prompt="A cinematic wide shot of a small fishing boat at sunset",
    height=704,
    width=1280,
    num_frames=121,  # ~5s @ 24fps
    num_inference_steps=50,
    guidance_scale=5.0,
).frames[0]

export_to_video(frames, "wan22_output.mp4", fps=24)
```

### 24GB (3090 / 4090)

Native-ish 720p/24fps Wan 5B with official-style flags. Typical inference path uses offload + dtype conversion + **T5 on CPU**-without them, VRAM needs can jump into multi-GPU territory.

```bash
huggingface-cli download Wan-AI/Wan2.2-TI2V-5B--local-dir ./wan2.2-ti2v-5b
git clone https://github.com/Wan-Video/Wan2.2.git
cd Wan2.2
pip install-r requirements.txt

python generate.py \
 --task t2v-5B \
 --size 1280*704 \
 --ckpt_dir ../wan2.2-ti2v-5b \
 --offload_model True \
 --convert_model_dtype \
 --t5_cpu \
 --prompt "A cinematic wide shot of a small fishing boat at sunset"
```

A14B Wan variants may run only with community quant/offload. SkyReels long-form is faster than on smaller cards.

**Experience rule:** hardware tier changes iteration speed more than hopping between open models of similar class.

## When closed models still win

Open video has not fully matched **Veo / Runway-class** physics consistency, prompt adherence, and artifact control. Side-by-sides still show a gap.

| Choose closed | Choose open / local |
|---------------|---------------------|
| Client-facing peak fidelity | Prototyping, mood boards, pre-vis |
| One bad take costs more than the sub | Offline / air-gapped / no cloud policy |
| Editorial polish first | High iteration count, low per-clip cost |

Rough ROI: a used 24GB card can approach a year of unlimited cloud video pricing-then marginal cost is electricity. Many pipelines use **both**: local for drafts, paid API for finals.

## What to do this week

1. **8–12GB:** ComfyUI + Wan 2.2 TI2V-5B + offload  
2. **16GB:** Same, then try SkyReels-V2 1.3B if you need length  
3. **24GB:** Wan generate script with the three offload-related flags; start 720p  

By the end of a weekend you’ll know if local video generation fits your patience and quality bar-without trusting aggregator VRAM myths.
