import os
import shutil
import glob
import re
import xml.etree.ElementTree as ET
from androguard.core.axml import AXMLPrinter
import lxml.etree as etree

def copy_fonts():
    print("--- 1. Extracting Official APK Fonts ---")
    font_sources = [
        "aladin apk/res/font",
        "aladin apk/assets"
    ]
    target_dir = "app/fonts"
    os.makedirs(target_dir, exist_ok=True)
    
    extracted = []
    for src in font_sources:
        if os.path.exists(src):
            for f in os.listdir(src):
                if f.endswith(('.ttf', '.otf')):
                    src_file = os.path.join(src, f)
                    dst_file = os.path.join(target_dir, f)
                    shutil.copy2(src_file, dst_file)
                    extracted.append(f)
                    print(f"Copied font: {f} -> {target_dir}/")
    return extracted

def copy_raw_images():
    print("\n--- 2. Extracting Raw Images from APK ---")
    target_dir = "public/assets/raw"
    os.makedirs(target_dir, exist_ok=True)
    
    search_dirs = [
        "aladin apk/res/drawable",
        "aladin apk/res/drawable-hdpi-v4",
        "aladin apk/res/drawable-xxhdpi-v4",
        "aladin apk/res/drawable-xxxhdpi-v4",
        "aladin apk/res/mipmap-xxhdpi-v4",
        "aladin apk/res/mipmap-xxxhdpi-v4",
        "aladin apk/assets"
    ]
    
    count = 0
    for sdir in search_dirs:
        if os.path.exists(sdir):
            for root, _, files in os.walk(sdir):
                for f in files:
                    if f.lower().endswith(('.png', '.webp', '.jpg', '.jpeg')):
                        src_path = os.path.join(root, f)
                        dst_path = os.path.join(target_dir, f)
                        shutil.copy2(src_path, dst_path)
                        count += 1
    print(f"Copied {count} raw images to {target_dir}/")

def convert_color(c_str):
    if not c_str:
        return None, None
    c_str = c_str.strip()
    # Android color is often #AARRGGBB or #RRGGBB
    if c_str.startswith('#'):
        c = c_str[1:]
        if len(c) == 8:
            a_hex = c[:2]
            rgb_hex = c[2:]
            alpha = int(a_hex, 16) / 255.0
            return f"#{rgb_hex}", round(alpha, 3)
        elif len(c) == 6:
            return f"#{c}", 1.0
        elif len(c) == 3:
            return f"#{c}", 1.0
        elif len(c) == 4:
            a_hex = c[0]
            rgb_hex = c[1:]
            alpha = int(a_hex + a_hex, 16) / 255.0
            return f"#{rgb_hex[0]*2}{rgb_hex[1]*2}{rgb_hex[2]*2}", round(alpha, 3)
    return c_str, 1.0

def vector_to_svg(xml_root):
    # Android namespace
    ns = '{http://schemas.android.com/apk/res/android}'
    
    vp_w = xml_root.attrib.get(f'{ns}viewportWidth', '24')
    vp_h = xml_root.attrib.get(f'{ns}viewportHeight', '24')
    
    # Clean float strings like "78.000000" -> "78"
    try:
        vp_w_val = float(vp_w)
        vp_w = f"{vp_w_val:g}"
    except:
        pass
    try:
        vp_h_val = float(vp_h)
        vp_h = f"{vp_h_val:g}"
    except:
        pass
        
    svg_elems = []
    
    def parse_elem(elem, indent="  "):
        tag = elem.tag.split('}')[-1]
        
        if tag == 'path':
            d = elem.attrib.get(f'{ns}pathData', '')
            if not d:
                return
            
            fill_color = elem.attrib.get(f'{ns}fillColor', '')
            stroke_color = elem.attrib.get(f'{ns}strokeColor', '')
            stroke_width = elem.attrib.get(f'{ns}strokeWidth', '')
            fill_alpha = elem.attrib.get(f'{ns}fillAlpha', '')
            stroke_alpha = elem.attrib.get(f'{ns}strokeAlpha', '')
            stroke_cap = elem.attrib.get(f'{ns}strokeLineCap', '')
            stroke_join = elem.attrib.get(f'{ns}strokeLineJoin', '')
            fill_type = elem.attrib.get(f'{ns}fillType', '')
            
            attrs = [f'd="{d}"']
            
            if fill_color:
                hex_c, a_val = convert_color(fill_color)
                attrs.append(f'fill="{hex_c}"')
                if a_val is not None and a_val < 1.0:
                    attrs.append(f'fill-opacity="{a_val}"')
            else:
                attrs.append('fill="none"')
                
            if fill_alpha:
                try:
                    attrs.append(f'fill-opacity="{float(fill_alpha):g}"')
                except:
                    pass
                    
            if stroke_color:
                s_hex, s_a = convert_color(stroke_color)
                attrs.append(f'stroke="{s_hex}"')
                if s_a is not None and s_a < 1.0:
                    attrs.append(f'stroke-opacity="{s_a}"')
            if stroke_width:
                try:
                    attrs.append(f'stroke-width="{float(stroke_width):g}"')
                except:
                    attrs.append(f'stroke-width="{stroke_width}"')
            if stroke_cap:
                attrs.append(f'stroke-linecap="{stroke_cap}"')
            if stroke_join:
                attrs.append(f'stroke-linejoin="{stroke_join}"')
            if fill_type == 'evenOdd':
                attrs.append('fill-rule="evenodd"')
                
            svg_elems.append(f'{indent}<path {" ".join(attrs)} />')
            
        elif tag == 'clip-path':
            d = elem.attrib.get(f'{ns}pathData', '')
            if d:
                svg_elems.append(f'{indent}<clipPath><path d="{d}" /></clipPath>')
                
        elif tag == 'group':
            tx = elem.attrib.get(f'{ns}translateX', '0')
            ty = elem.attrib.get(f'{ns}translateY', '0')
            sx = elem.attrib.get(f'{ns}scaleX', '1')
            sy = elem.attrib.get(f'{ns}scaleY', '1')
            rot = elem.attrib.get(f'{ns}rotation', '0')
            px = elem.attrib.get(f'{ns}pivotX', '0')
            py = elem.attrib.get(f'{ns}pivotY', '0')
            
            transforms = []
            if tx != '0' or ty != '0':
                transforms.append(f'translate({float(tx):g}, {float(ty):g})')
            if rot != '0':
                transforms.append(f'rotate({float(rot):g}, {float(px):g}, {float(py):g})')
            if sx != '1' or sy != '1':
                transforms.append(f'scale({float(sx):g}, {float(sy):g})')
                
            tf_attr = f' transform="{" ".join(transforms)}"' if transforms else ''
            svg_elems.append(f'{indent}<g{tf_attr}>')
            for child in elem:
                parse_elem(child, indent + "  ")
            svg_elems.append(f'{indent}</g>')
            
    for child in xml_root:
        parse_elem(child)
        
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {vp_w} {vp_h}" width="{vp_w}" height="{vp_h}" fill="none">
{chr(10).join(svg_elems)}
</svg>'''
    return svg_content

def convert_all_vectors():
    print("\n--- 3. Converting Vector Drawables to SVG ---")
    src_dir = "aladin apk/res/drawable"
    dst_dir = "public/assets/icons"
    os.makedirs(dst_dir, exist_ok=True)
    
    xml_files = [f for f in os.listdir(src_dir) if f.endswith('.xml')]
    converted = 0
    errors = 0
    
    for f in xml_files:
        path = os.path.join(src_dir, f)
        try:
            with open(path, 'rb') as fp:
                raw_data = fp.read()
                
            # Use androguard AXMLPrinter
            axml = AXMLPrinter(raw_data)
            xml_obj = axml.get_xml_obj()
            if xml_obj is None:
                continue
                
            tag_name = xml_obj.tag.split('}')[-1]
            if tag_name == 'vector':
                svg_code = vector_to_svg(xml_obj)
                svg_name = f.replace('.xml', '.svg')
                dst_path = os.path.join(dst_dir, svg_name)
                with open(dst_path, 'w', encoding='utf-8') as out_f:
                    out_f.write(svg_code)
                converted += 1
        except Exception as e:
            errors += 1
            
    print(f"Successfully converted {converted} Vector Drawables into SVG! (Errors: {errors})")

if __name__ == '__main__':
    copy_fonts()
    copy_raw_images()
    convert_all_vectors()

