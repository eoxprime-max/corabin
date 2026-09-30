import struct
import json
import os

CHUNK_PATH = 'framerusercontent.com/cms/IXSaWiIa8CVWF4cTDQl7/KLguAbcGnqw9xQxVKuf9/l0aFVHEAD-chunk-default-0.framercms'

with open(CHUNK_PATH, 'rb') as f:
    buf = f.read()

offset = 0

def read_uint8():
    global offset
    v = buf[offset]
    offset += 1
    return v

def read_int8():
    global offset
    v = struct.unpack_from(">b", buf, offset)[0]
    offset += 1
    return v

def read_uint16():
    global offset
    v = struct.unpack_from(">H", buf, offset)[0]
    offset += 2
    return v

def read_uint32():
    global offset
    v = struct.unpack_from(">I", buf, offset)[0]
    offset += 4
    return v

def read_int64():
    global offset
    v = struct.unpack_from(">q", buf, offset)[0]
    offset += 8
    return v

def read_float64():
    global offset
    v = struct.unpack_from(">d", buf, offset)[0]
    offset += 8
    return v

def read_string():
    global offset
    length = read_uint32()
    s = buf[offset:offset+length].decode("utf-8")
    offset += length
    return s

def read_json():
    return json.loads(read_string())

def read_val():
    t = read_uint8()
    if t == 0:
        return None
    elif t == 1:
        count = read_uint16()
        arr = [read_val() for _ in range(count)]
        return {"type": "array", "value": arr}
    elif t == 2:
        return {"type": "boolean", "value": read_uint8() != 0}
    elif t == 3:
        return {"type": "color", "value": read_string()}
    elif t == 4:
        ms = read_int64()
        return {"type": "date", "value": ms}
    elif t == 5:
        return {"type": "enum", "value": read_string()}
    elif t == 6:
        return {"type": "file", "value": read_string()}
    elif t == 7:
        return {"type": "link", "value": read_json()}
    elif t == 8:
        return {"type": "number", "value": read_float64()}
    elif t == 9:
        count = read_uint16()
        d = {}
        for _ in range(count):
            k = read_string()
            d[k] = read_val()
        return {"type": "object", "value": d}
    elif t == 10:
        return {"type": "responsiveimage", "value": read_json()}
    elif t == 11:
        return {"type": "richtext", "value": read_json()}
    elif t == 12:
        return {"type": "string", "value": read_string()}
    elif t == 13:
        return {"type": "vectorsetitem", "value": read_string()}
    else:
        raise ValueError(f"Unknown type tag: {t} at offset {offset-1}")

def decode_chunk():
    global offset
    offset = 0
    count = read_uint32()
    print(f"Total blog records in chunk: {count}")
    records = []
    for i in range(count):
        item_offset = offset
        field_count = read_uint16()
        fields = {}
        for _ in range(field_count):
            fname = read_string()
            fval = read_val()
            fields[fname] = fval
        records.append({
            "_offset": item_offset,
            "_length": offset - item_offset,
            "fields": fields
        })
    return records

records = decode_chunk()

with open('decoded_blog_records.json', 'w', encoding='utf-8') as f:
    json.dump([r['fields'] for r in records], f, indent=2, ensure_ascii=False)

print("Saved decoded_blog_records.json successfully!")

print("\n=== SUMMARY OF BLOG RECORDS ===")
for i, r in enumerate(records):
    f = r['fields']
    r_id = f.get('id', {}).get('value')
    title = f.get('gQGk7Fm8D', {}).get('value') if 'gQGk7Fm8D' in f else None
    slug = f.get('OjAlyiakl', {}).get('value') if 'OjAlyiakl' in f else None
    print(f"Blog {i+1}: ID={r_id} | Slug={slug} | Keys={list(f.keys())}")
    for k, v in f.items():
        if isinstance(v, dict):
            val = v.get('value')
            if v.get('type') == 'string':
                print(f"   {k}: {str(val)[:80]}")
            elif v.get('type') == 'date':
                print(f"   {k} (date): {val}")
            elif v.get('type') == 'responsiveimage':
                print(f"   {k} (image): {val.get('src')[:80] if isinstance(val, dict) else val}")
