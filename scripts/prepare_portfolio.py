import os
import shutil
import hashlib
import subprocess
import json
import re
from PIL import Image

PORTFOLIO_ROOT = r"C:\Users\USER\Desktop\malala-portfolio"
DESKTOP = r"C:\Users\USER\Desktop"
MALALA1 = os.path.join(DESKTOP, "malala-1")
MALALA2 = os.path.join(DESKTOP, "malala-2")

ASSETS_DIR = os.path.join(PORTFOLIO_ROOT, "assets")
IMG_DEST = os.path.join(ASSETS_DIR, "images")
VID_DEST = os.path.join(ASSETS_DIR, "videos")
THUMB_DEST = os.path.join(ASSETS_DIR, "thumbnails")
GAMES_DEST = os.path.join(ASSETS_DIR, "games")
DOCS_DEST = os.path.join(ASSETS_DIR, "docs")
LOGO_DEST = os.path.join(ASSETS_DIR, "logo")

for d in [IMG_DEST, VID_DEST, THUMB_DEST, GAMES_DEST, DOCS_DEST, LOGO_DEST]:
    os.makedirs(d, exist_ok=True)

def get_hash(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(16384):
            h.update(chunk)
    return h.hexdigest()

def format_size(bytes_num):
    if bytes_num >= 1024 * 1024:
        return f"{bytes_num / (1024 * 1024):.1f} MB"
    elif bytes_num >= 1024:
        return f"{bytes_num / 1024:.0f} KB"
    return f"{bytes_num} B"

def sanitize_filename(name):
    clean = re.sub(r'[^\w\.-]', '_', name)
    clean = re.sub(r'_+', '_', clean)
    return clean.strip('_')

# Probe video metadata
def probe_video(path):
    cmd = [
        'ffprobe', '-v', 'quiet', '-print_format', 'json',
        '-show_format', '-show_streams', path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    duration = 0.0
    width = 1280
    height = 720
    try:
        data = json.loads(res.stdout)
        fmt = data.get('format', {})
        duration = float(fmt.get('duration', 0))
        video_s = next((s for s in data.get('streams', []) if s.get('codec_type') == 'video'), {})
        width = int(video_s.get('width', 1280))
        height = int(video_s.get('height', 720))
    except Exception as e:
        pass
    return duration, width, height

def generate_video_thumbnail(video_path, thumb_path, duration):
    # seek to 1 second or 10%
    seek_time = "00:00:01.000" if duration > 2 else "00:00:00.200"
    cmd = [
        'ffmpeg', '-y', '-ss', seek_time, '-i', video_path,
        '-vframes', '1', '-q:v', '2', thumb_path
    ]
    subprocess.run(cmd, capture_output=True)
    if not os.path.exists(thumb_path) or os.path.getsize(thumb_path) == 0:
        # Fallback seek to 0s
        cmd = ['ffmpeg', '-y', '-ss', '00:00:00.000', '-i', video_path, '-vframes', '1', '-q:v', '2', thumb_path]
        subprocess.run(cmd, capture_output=True)

print("Starting scan and deduplication...")

# Track processed hashes
seen_hashes = {}

# 1. Process Logo
logo_source = os.path.join(MALALA1, "WhatsApp Image 2026-10-24 at 9.14.21 AM.jpeg")
logo_dest_file = os.path.join(LOGO_DEST, "mahmuda_khatun_logo.jpg")
if os.path.exists(logo_source):
    shutil.copy2(logo_source, logo_dest_file)
    seen_hashes[get_hash(logo_source)] = "logo"
    print("Logo copied:", logo_dest_file)

# 2. Process Games
games_meta = []
bear_game_src = os.path.join(MALALA1, "malala-2", "bear-chase-game.html")
if os.path.exists(bear_game_src):
    dest = os.path.join(GAMES_DEST, "bear-chase-game.html")
    shutil.copy2(bear_game_src, dest)
    seen_hashes[get_hash(bear_game_src)] = "game"
    games_meta.append({
        "id": "game-bear-run",
        "title": "Bear Chase Run",
        "badge": "Playable HTML5 Game",
        "category": "Games",
        "type": "game",
        "file": "assets/games/bear-chase-game.html",
        "previewImg": "assets/images/ChatGPT_Image_Oct_4_2026_10_36_27_AM.png", # scenic backdrop
        "description": "An action-packed HTML5 Canvas arcade game where players race through natural terrain, jump over obstacles, and escape a pursuing forest bear with real-time scoring and sound synthesizers.",
        "playable": True,
        "controls": "Space / Tap to Jump, Arrow Keys to Move",
        "tags": ["HTML5", "Canvas", "Web Audio API", "Arcade", "Endless Runner"],
        "featured": True
    })

calc_src = os.path.join(MALALA1, "malala-2", "calculator.html")
if os.path.exists(calc_src):
    dest = os.path.join(GAMES_DEST, "calculator.html")
    shutil.copy2(calc_src, dest)
    seen_hashes[get_hash(calc_src)] = "game"
    games_meta.append({
        "id": "app-calculator",
        "title": "Precision Glassmorphism Calculator",
        "badge": "Interactive Web App",
        "category": "Interactive Apps",
        "type": "game",
        "file": "assets/games/calculator.html",
        "previewImg": "assets/images/Apnar_Projukti_Gyan_Score_60__1_.png",
        "description": "A modern, ultra-responsive digital calculator designed with dark glassmorphism styling, tactile button feedback, and precision arithmetic calculation routines.",
        "playable": True,
        "controls": "Click or Tap Buttons, Keyboard Numeric Input",
        "tags": ["JavaScript", "Glassmorphism", "CSS Neo-Dark", "Utility Tool"],
        "featured": True
    })

# 3. Process Documents
docs_meta = []
# CV
cv_src = os.path.join(MALALA1, "MAHMUDA.pdf")
if os.path.exists(cv_src):
    dest = os.path.join(DOCS_DEST, "MAHMUDA-Resume.pdf")
    shutil.copy2(cv_src, dest)
    seen_hashes[get_hash(cv_src)] = "doc"
    docs_meta.append({
        "id": "doc-resume",
        "title": "Mahmuda Khatun — Professional CV & Resume",
        "badge": "PDF Document",
        "category": "Career & Documents",
        "type": "document",
        "file": "assets/docs/MAHMUDA-Resume.pdf",
        "size": format_size(os.path.getsize(cv_src)),
        "description": "Official resume highlighting academic credentials from Government Rajendra College (M.A./M.S.S. & B.A./B.S.S.), professional freelance web design expertise, computer transcription, and office software competencies.",
        "tags": ["Curriculum Vitae", "Government Rajendra College", "Web Designer", "Verified"],
        "featured": True
    })

# AI Training Module
train_src = os.path.join(DESKTOP, "AI Training Module.pdf")
if os.path.exists(train_src):
    dest = os.path.join(DOCS_DEST, "AI-Training-Module.pdf")
    shutil.copy2(train_src, dest)
    docs_meta.append({
        "id": "doc-ai-training",
        "title": "AI Based Basic Technology Training Module",
        "badge": "PDF Syllabus",
        "category": "Training & Skills",
        "type": "document",
        "file": "assets/docs/AI-Training-Module.pdf",
        "size": format_size(os.path.getsize(train_src)),
        "description": "Comprehensive curriculum module covering conversational AI architectures, generative intelligence tools (ChatGPT, Copilot, DeepSeek), prompt engineering, and digital workflows.",
        "tags": ["AI Training", "Prompt Engineering", "ChatGPT", "DeepSeek", "Syllabus"],
        "featured": False
    })

# Technology Knowledge Score Report (Score 60%)
score_src = os.path.join(MALALA1, "Apnar_Projukti_Gyan_Score_60 (1).png")
if os.path.exists(score_src):
    dest_name = "Apnar_Projukti_Gyan_Score_60.png"
    dest = os.path.join(IMG_DEST, dest_name)
    shutil.copy2(score_src, dest)
    seen_hashes[get_hash(score_src)] = "doc_img"
    docs_meta.append({
        "id": "doc-tech-assessment",
        "title": "Technology Knowledge Assessment Report (Malala Rahman)",
        "badge": "Verified Assessment",
        "category": "Certifications",
        "type": "document_image",
        "file": f"assets/images/{dest_name}",
        "size": format_size(os.path.getsize(score_src)),
        "verificationId": "AGY-D0EBY8WY",
        "score": "60%",
        "date": "07/10/2026",
        "description": "Verified digital assessment report evaluating foundational technology acumen, digital tool comprehension, and modern software fluency.",
        "tags": ["Certification", "Score 60%", "Malala Rahman", "Verified Digital Assessment"],
        "featured": True
    })

# 4. Process Videos
videos_meta = []
vid_sources = []
for root, dirs, files in os.walk(MALALA1):
    for f in files:
        if f.lower().endswith(('.mp4', '.mov', '.webm')):
            vid_sources.append(os.path.join(root, f))
for root, dirs, files in os.walk(MALALA2):
    for f in files:
        if f.lower().endswith(('.mp4', '.mov', '.webm')):
            vid_sources.append(os.path.join(root, f))

# Also desktop penguin video if unique
dt_vid = os.path.join(DESKTOP, "media-generation-penguins-dancing-on-snow-0-ae074131-c7fa-4f12-9aa5-36366d799a75.mp4")
if os.path.exists(dt_vid):
    vid_sources.append(dt_vid)

vid_titles = {
    "Boy_playing_with_fish": ("Boy Playing with Fish in Water", "AI Animation & Nature", "A cinematic character animation capturing a young boy interacting gently with shimmering fish in clear waters.", True),
    "Broccoli_and_cauliflower_arguing": ("Broccoli & Cauliflower Animated Dialogue", "Character Animation", "An expressive, whimsical 3D animated conversation between vegetable characters with expressive facial dynamics.", True),
    "Broccoli_becomes_superhero": ("Broccoli Becomes a Superhero", "Character Animation", "High-energy comedic superhero transformation sequence featuring animated vegetable characters with vibrant VFX.", True),
    "coffee-video-with-balcony": ("Artisanal Coffee & Balcony View Commercial", "Commercials & UGC", "A tranquil, atmospheric commercial promo showcasing fresh artisanal coffee against a picturesque scenic balcony backdrop.", True),
    "Fish_swimming_in_ocean": ("Bioluminescent Marine Life in Deep Ocean", "Nature & Visuals", "An immersive deep-ocean sequence featuring glowing tropical clownfish and coral reefs with realistic fluid caustics.", True),
    "more-penguins-join-dancing": ("Penguins Celebration Dance Party", "Character Animation", "Delightful Antarctic character animation showcasing adorable penguins synchronizing steps across icy terrain.", True),
    "penguins-dancing-on-snow": ("Penguins Dancing on Snow Dunes", "Character Animation", "Vibrant, playful AI motion generation depicting penguins performing lively choreography on pristine snow dunes.", False),
    "penguins-dancing-combined": ("Dancing Penguins Master Compilation", "Creative Showcase", "The full extended director's cut combining animated Antarctic dance routines with dynamic tempo and camera sweeps.", True),
    "Text to video": ("Cinematic Text-to-Video Motion Sequence", "AI Motion Graphics", "Experimental text-to-video prompt translation generating intricate motion dynamics and atmospheric light gradients.", False),
    "UGC_video_ad_script_1080p_20261004110447": ("UGC Video Commercial Concept Alpha (1080p)", "Commercials & UGC", "Polished vertical social media user-generated style commercial ad formatted for high engagement and conversions.", False),
    "UGC_video_ad_script_1080p": ("UGC Video Commercial Concept Beta (1080p)", "Commercials & UGC", "Dynamic UGC product spotlight script sequence with engaging pacing, crisp visual storytelling, and clear call-to-action.", False),
    "Untitled_Scene": ("Cinematic Narrative Sequence", "Creative Storytelling", "Richly detailed visual scene exploring cinematic depth of field, dramatic backlighting, and narrative emotion.", False),
    "video_a3bpk95c": ("AI Stylized Motion Vignette", "AI Motion Graphics", "A brief artistic vignette displaying stylized motion fluidity, generative color transitions, and creative framing.", False),
    "WhatsApp Video 2026-10-20": ("Creative Visual Project — Sequence I", "Creative Showcase", "Original motion project exploring smooth camera framing, color grading, and creative storytelling.", False),
    "WhatsApp Video 2026-10-22": ("Creative Visual Project — Sequence II", "Creative Showcase", "Creative motion project featuring dynamic pacing, rich atmospheric elements, and engaging rhythm.", False),
    "WhatsApp Video 2026-10-24": ("Creative Visual Project — Sequence III", "Creative Showcase", "High-resolution creative motion sequence with elegant framing and subtle visual effects.", False),
    "WhatsApp Video 2026-10-25": ("Creative Visual Project — Sequence IV", "Creative Showcase", "Extended motion composition featuring delicate camera pans, atmospheric lighting, and visual elegance.", False),
}

vid_idx = 1
for v_path in vid_sources:
    h = get_hash(v_path)
    if h in seen_hashes:
        continue
    seen_hashes[h] = "video"
    
    base_name = os.path.basename(v_path)
    clean_name = sanitize_filename(base_name)
    dest_path = os.path.join(VID_DEST, clean_name)
    shutil.copy2(v_path, dest_path)
    
    duration, w, h_dim = probe_video(dest_path)
    
    # Generate thumbnail
    thumb_name = os.path.splitext(clean_name)[0] + "_thumb.jpg"
    thumb_path = os.path.join(THUMB_DEST, thumb_name)
    generate_video_thumbnail(dest_path, thumb_path, duration)
    
    # Match metadata
    matched_title = None
    matched_cat = "Video Showcase"
    matched_desc = f"Creative video production: {base_name}. Rendered in crisp {w}x{h_dim} resolution."
    is_featured = False
    
    for key, (t, cat, desc, feat) in sorted(vid_titles.items(), key=lambda x: len(x[0]), reverse=True):
        if key.lower() in base_name.lower():
            matched_title = t
            matched_cat = cat
            matched_desc = desc
            is_featured = feat
            break
            
    if not matched_title:
        clean_title = re.sub(r'[\d_]+', ' ', os.path.splitext(base_name)[0]).strip().title()
        matched_title = clean_title or f"Creative Video {vid_idx}"
        
    videos_meta.append({
        "id": f"vid-{vid_idx}",
        "title": matched_title,
        "originalName": base_name,
        "category": matched_cat,
        "type": "video",
        "file": f"assets/videos/{clean_name}",
        "thumbnail": f"assets/thumbnails/{thumb_name}",
        "duration": f"{duration:.1f}s",
        "resolution": f"{w}x{h_dim}",
        "size": format_size(os.path.getsize(dest_path)),
        "description": matched_desc,
        "featured": is_featured,
        "tags": [matched_cat, f"{w}p", "MP4", "Motion"]
    })
    print(f"Video {vid_idx}: {matched_title} ({duration:.1f}s) copied.")
    vid_idx += 1

# 5. Process Images
images_meta = []
img_sources = []
for root, dirs, files in os.walk(MALALA1):
    for f in files:
        if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            img_sources.append(os.path.join(root, f))

img_titles = {
    "Beautiful Bangladesh Rivers": ("Beautiful Bangladesh Rivers & Serpentine Waterways", "AI Art & Nature", "A breathtaking panoramic rendering depicting the lush riverine majesty of Bangladesh with winding waters and golden sunlight.", True),
    "ChatGPT Image Oct 4, 2026, 10_36_27 AM": ("Floral Serenity Garden Portrait", "Portraits & Fashion", "A warm and graceful portrait of a young woman collecting fresh white blossoms in a blossoming garden at golden hour.", True),
    "ChatGPT Image Oct 4, 2026, 11_19_38 AM": ("Vibrant Coral Reef & Tropical Marine Life", "AI Art & Nature", "A hyper-detailed underwater composition depicting a bustling marine ecosystem teeming with clownfish, sea anemones, and dappled sunlight.", True),
    "ChatGPT Image Oct 5, 2026, 09_19_03 AM": ("Navyelle Haute Couture Evening Gown", "Branding & Fashion Design", "Luxury haute couture fashion branding design featuring a midnight navy embroidered gown with golden typography: 'Elegance Woven in Every Detail'.", True),
    "ChatGPT Image Oct 5, 2026, 12_41_28 PM": ("Royal Crimson Bridal Ensemble", "Portraits & Fashion", "An exquisite traditional bridal portrait adorned in elaborate gold-embroidered crimson lehenga, intricate jewelry, and opulent floral decor.", True),
    "ChatGPT_Image_Oct_4,_2026,_20261004112735": ("Deep Coral Reef Biodiversity", "AI Art & Nature", "Lush aquatic sanctuary populated by multi-colored schools of reef fish, sun rays penetrating transparent sapphire waters.", False),
    "A huge glowing": ("Luminous Full Moon Over Serene Lake", "AI Art & Scenery", "A tranquil nocturnal masterpiece showcasing a radiant full moon reflected upon a glassy lake with starry skies and quiet village cottages.", True),
    "ai imeg ta diya": ("Cinematic Moonlit Horizon & Water Surface", "AI Art & Scenery", "Atmospheric moonlit landscape study with glistening ripples, palm trees, and starry constellation canopy.", False),
    "image.png_20261018123354": ("Bella Vita Luxury 'CEO Man' Perfume Design", "Branding & Product Design", "High-end product photography and visual concept for Bella Vita Luxury CEO Man Eau De Parfum on natural stone and parchment.", True),
    "Perfume_poster_on_marble_podium": ("Luxury Fragrance on Marble Podium", "Branding & Product Design", "Commercial poster mockup showcasing luxury fragrance packaging balanced gracefully over an architectural marble podium.", True),
    "Saved_frame_from_Room_layout": ("Modern Architectural Room Layout", "Architecture & Interiors", "Clean contemporary architectural layout visualizing proportion, ergonomic spatial arrangement, and minimalist furniture placement.", False),
    "WhatsApp Image 2026-10-03 at 12.42.04 PM": ("Dynamic Urban Cafe Lifestyle Concept", "Branding & Lifestyle", "Expressive conceptual lifestyle shot featuring levitating phone, designer sunglasses, and iced coffee in midair.", True),
    "WhatsApp Image 2026-10-03 at 12.42.05 PM": ("Slow Steady Club Artisanal Iced Coffee", "Branding & Product Design", "Minimalist studio product spotlight showcasing the signature 'Slow Steady Club - Ethos 09' iced coffee cup.", True),
    "WhatsApp Image 2026-10-03 at 12.42.05 PM (2)": ("Slow Steady Club Cafe Editorial", "Branding & Product Design", "Editorial branding photography celebrating artisanal cold brew coffee craft and minimalist typographic identity.", False),
    "WhatsApp Image 2026-10-03 at 12.42.06 PM (1)": ("Modern Cafe Menu Concept", "Branding & Product Design", "Sophisticated visual brand asset crafted for contemporary cafe culture and specialty beverage aesthetics.", False),
    "WhatsApp Image 2026-10-03 at 12.42.06 PM": ("Slow Steady Club Brand Identity Poster", "Branding & Product Design", "Signature typographic identity showcasing clean monochrome design and modern lifestyle aesthetics.", False),
    "fefe075ad3a113d9c8dde27df86d9a76": ("Contemporary Aesthetic Fashion Study", "Portraits & Fashion", "An evocative portrait composition focusing on ambient natural light, soft shadows, and clean fashion styling.", False),
    "images (1)": ("Modern Editorial Look Study", "Portraits & Fashion", "Editorial fashion visual exploring subtle earth tones, relaxed tailoring, and modern lifestyle presence.", False),
    "images.jpg": ("Urban Chic Creative Portrait", "Portraits & Fashion", "Creative styling study featuring contemporary streetwear aesthetics, tonal balance, and cinematic lighting.", False),
    "Cabin_on_misty_mountain_slope_20261018115629": ("Misty Alpine Mountain Cabin", "Architecture & Interiors", "A serene wooden alpine cabin nestled amidst dense pine forests and swirling mountain morning mist.", False),
    "Cabin_on_misty_mountain_slope_20261018115629_2": ("Alpine Cabin Twilight View", "Architecture & Interiors", "Atmospheric architectural view of a secluded mountain sanctuary under soft evening twilight hues.", False),
    "Cabin_on_misty_mountain_slope_20261018115629_3": ("Woodland Mountain Chalet", "Architecture & Interiors", "Cozy timber chalet design integrated seamlessly with rugged mountain slopes and forest foliage.", False),
    "Cabin_on_mountain_slope_20261018115629": ("Highland Mountain Retreat", "Architecture & Interiors", "Panoramic vista of an idyllic mountain cabin surrounded by wildflower meadows and steep mountain peaks.", False),
    "ChatGPT Image Oct 5, 2026, 12_27_40 PM": ("Cozy Autumn Reading Haven", "Architecture & Interiors", "Warm rustic interior featuring oversized soft armchair, stacked vintage novels, and golden autumn foliage.", False),
    "Coffee_shop_interior_with_espres": ("Boutique Espresso Bar & Lounge", "Architecture & Interiors", "Architectural interior visual of a bustling modern coffee shop with brushed bronze espresso machines and timber accents.", False),
    "Coffee_shop_interior_with_furnis._20261018115629_2": ("Artisanal Cafe Seating Design", "Architecture & Interiors", "Modern hospitality interior rendering highlighting texture contrasts of brick, wood, and dark metal fixtures.", False),
    "Coffee_shop_interior_with_furnis._20261018115629_3": ("Rustic Modern Cafe Lounge", "Architecture & Interiors", "Spacious open-plan cafe layout welcoming guests with lush indoor greenery and warm lamplight.", False),
    "Coffee_shop_interior_with_furnis": ("Warm Timber Cafe Interior", "Architecture & Interiors", "Warm interior ambiance showcasing custom wooden tables, ambient pendant lights, and inviting seating pockets.", False),
    "Cozy_reading_nook_by_window_20261018115629_2": ("Rainy Day Window Nook", "Architecture & Interiors", "Comfortable window seat looking out at a gentle rain, surrounded by floor-to-ceiling bookshelves.", False),
    "Cozy_reading_nook_by_window_20261018115629_3": ("Warm Hearth Book Sanctuary", "Architecture & Interiors", "Cozy interior nook illuminated by warm firelight and ambient architectural backlighting.", False),
    "Cozy_reading_nook_by_window_20261018115629_4": ("Twilight Reading Retreat", "Architecture & Interiors", "Peaceful twilight sanctuary featuring panoramic bay window views and thoughtful interior styling.", False),
    "Cozy_reading_nook_by_window": ("Sunlit Reading Nook by the Window", "Architecture & Interiors", "Intimate reading alcove bathed in gentle morning sunlight with plush pillows and a steaming cup of tea.", False),
    "Rooftop_garden_terrace_at_sunset_20261018115629_2": ("Golden Hour Skyline Terrace", "Architecture & Interiors", "Architectural rooftop design capturing golden hour illumination across wooden decking and modern planters.", False),
    "Rooftop_garden_terrace_at_sunset_20261018115629_3": ("Urban Oasis Rooftop Lounge", "Architecture & Interiors", "A tranquil high-rise botanical sanctuary offering comfortable lounge seating and evening skyline vistas.", False),
    "Rooftop_garden_terrace_at_sunset_20261018115629_4": ("Twilight Botanical Rooftop", "Architecture & Interiors", "Atmospheric rooftop garden visual emphasizing subtle landscape lighting and evening skyline vistas.", False),
    "Rooftop_garden_terrace_at_sunset": ("Sunset Rooftop Garden Terrace", "Architecture & Interiors", "Luxurious urban rooftop terrace filled with potted botanical greenery, warm fairy lights, and sunset city views.", False),
    "WhatsApp Image 2026-10-03 at 12.42.05 PM (1)": ("Minimalist Interior Accent", "Architecture & Interiors", "Understated architectural corner study playing with light geometry and serene earth tones.", False),
}

img_idx = 1
for i_path in img_sources:
    h = get_hash(i_path)
    if h in seen_hashes:
        continue
    seen_hashes[h] = "image"
    
    base_name = os.path.basename(i_path)
    clean_name = sanitize_filename(base_name)
    dest_path = os.path.join(IMG_DEST, clean_name)
    shutil.copy2(i_path, dest_path)
    
    try:
        with Image.open(dest_path) as im:
            w, h_dim = im.size
            im_format = im.format
    except Exception:
        w, h_dim = 1200, 800
        im_format = "JPEG"
        
    matched_title = None
    matched_cat = "Visual Arts"
    matched_desc = f"High-resolution creative visual: {base_name}. Format: {im_format}."
    is_featured = False
    
    for key, (t, cat, desc, feat) in sorted(img_titles.items(), key=lambda x: len(x[0]), reverse=True):
        if key.lower() in base_name.lower():
            matched_title = t
            matched_cat = cat
            matched_desc = desc
            is_featured = feat
            break
            
    if not matched_title:
        clean_title = re.sub(r'[\d_]+', ' ', os.path.splitext(base_name)[0]).strip().title()
        matched_title = clean_title or f"Creative Visual {img_idx}"
        
    images_meta.append({
        "id": f"img-{img_idx}",
        "title": matched_title,
        "originalName": base_name,
        "category": matched_cat,
        "type": "image",
        "file": f"assets/images/{clean_name}",
        "dimensions": f"{w}x{h_dim}",
        "size": format_size(os.path.getsize(dest_path)),
        "description": matched_desc,
        "featured": is_featured,
        "tags": [matched_cat, f"{w}x{h_dim}", im_format]
    })
    print(f"Image {img_idx}: {matched_title} copied.")
    img_idx += 1

# Generate combined portfolio data
portfolio_data = {
    "profile": {
        "name": "Mahmuda Khatun",
        "nickname": "Malala",
        "fullName": "Mahmuda Khatun (Malala)",
        "tagline": "Creative Web Designer, AI Visual Artist & Digital Specialist",
        "location": "Bhagolpur, Goalundo, Rajbari, Bangladesh",
        "phone": "+880 1765 770196",
        "email": "mahmuda.khatun.portfolio@gmail.com",
        "education": [
            {
                "degree": "Master's Degree (Honours / M.A. / M.S.S.)",
                "institution": "Government Rajendra College",
                "location": "Faridpur, Bangladesh"
            },
            {
                "degree": "Bachelor's Degree (Honours / B.A. / B.S.S.)",
                "institution": "Government Rajendra College",
                "location": "Faridpur, Bangladesh"
            }
        ],
        "summary": "A dedicated and detail-oriented professional with an advanced academic background from Government Rajendra College. Experienced in responsive web design, data entry, computer transcription, AI visual art generation, and freelancing. Proven ability to handle technical tasks efficiently with high accuracy and a strong commitment to quality.",
        "skills": {
            "web": ["HTML5", "CSS3 / Modern Layouts", "Responsive Web Design", "UI/UX & Interactive Design", "Basic Web Maintenance"],
            "creative": ["AI Visual Prompting", "Motion Graphics & Text-to-Video", "Brand Design & Packaging", "Character Animation Direction"],
            "data": ["Precision Data Entry", "Computer Typing (English & Bengali)", "MS Word & Excel Mastery", "Digital Document Auditing"],
            "interests": ["Automotive Driving & Travel Exploration", "Vocal Music & Singing", "Culinary Arts & Recipe Exploration"]
        },
        "assessment": {
            "title": "Technology Knowledge Assessment",
            "score": "60%",
            "status": "Verified Digital Assessment",
            "verificationId": "AGY-D0EBY8WY",
            "date": "07/10/2026"
        },
        "logo": "assets/logo/mahmuda_khatun_logo.jpg"
    },
    "stats": {
        "totalImages": len(images_meta),
        "totalVideos": len(videos_meta),
        "totalGames": len(games_meta),
        "totalDocs": len(docs_meta)
    },
    "images": images_meta,
    "videos": videos_meta,
    "games": games_meta,
    "docs": docs_meta
}

# Write JS file
js_content = f"// Auto-generated portfolio data manifest\nconst PORTFOLIO_DATA = {json.dumps(portfolio_data, indent=2)};\nif (typeof module !== 'undefined') module.exports = PORTFOLIO_DATA;\n"
with open(os.path.join(PORTFOLIO_ROOT, "portfolio-data.js"), "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"\nSUCCESS! Processed:")
print(f"- {len(images_meta)} unique images")
print(f"- {len(videos_meta)} unique videos with poster thumbnails")
print(f"- {len(games_meta)} interactive games & apps")
print(f"- {len(docs_meta)} documents & certifications")
print(f"- Logo saved to assets/logo/mahmuda_khatun_logo.jpg")
print(f"- Manifest saved to portfolio-data.js")
