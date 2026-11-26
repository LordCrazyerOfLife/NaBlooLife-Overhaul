"""Names the 105 pieces cut from grids/PIEZAS.png (jdmparts/item-NNN.png) and writes the shop data.
   python -I _art-src/split_blobs.py "_art-src/grids/PIEZAS.png" jdmparts --thr 14 --grow 2 --min 900
   python -I _art-src/make_jdm_catalog.py          # names.json + rename + jdmmods-data.js
Single source of truth for the JDM Mods shop: part names, slot, rating bonus and base price (USD), plus the drift cars.
"""
import json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

# n, label, slot, bonus (drift rating points), base price USD
P = [
    (1, 'Big Frame Turbo', 'turbo', 4.0, 2800), (2, 'Ball-Bearing Turbo', 'turbo', 3.6, 2400), (3, 'Twin-Scroll Turbo (Bronze)', 'turbo', 3.2, 2200),
    (4, 'Billet Wheel Turbo', 'turbo', 4.4, 3400), (5, 'Turbo Engine Swap (4-Cyl)', 'engine', 5.0, 6500), (6, 'Red Top Engine Swap', 'engine', 6.0, 7800),
    (7, 'Blue Top Engine Swap', 'engine', 6.2, 8200), (8, 'Twin-Cam Engine Swap', 'engine', 5.5, 7000), (9, 'Inline-6 Engine Swap', 'engine', 6.8, 9500),
    (10, 'Red Valve-Cover Engine Swap', 'engine', 6.4, 8800), (11, 'Red Intake Filter', 'intake', 0.8, 140), (12, 'Blue Intake Filter', 'intake', 0.9, 150),
    (13, 'Cold Air Intake Kit', 'intake', 1.4, 380), (14, 'Blue Silicone Intercooler Pipe', 'piping', 0.8, 180), (15, 'Intake Pipe with Blow-Off', 'piping', 1.0, 240),
    (16, 'Big-Bend Piping Kit', 'piping', 1.1, 320), (17, 'Polished Piping Kit', 'piping', 1.1, 300), (18, 'Silicone Hose Kit', 'piping', 0.7, 160),
    (19, 'Rubber Boot Set', 'misc', 0.2, 40), (20, 'Front-Mount Intercooler', 'intercooler', 1.8, 650), (21, 'Large Intercooler', 'intercooler', 2.2, 850),
    (22, 'Aluminum Radiator', 'radiator', 1.0, 450), (23, 'Compact Radiator', 'radiator', 0.9, 400), (24, 'Wide Radiator', 'radiator', 1.2, 520),
    (25, 'Small Radiator', 'radiator', 0.8, 350), (26, 'Dual-Pass Radiator', 'radiator', 1.3, 560), (27, 'Radiator with Fan', 'radiator', 1.5, 620),
    (28, 'Oil Cooler Core', 'oilcooler', 1.0, 300), (29, 'Flat Oil Cooler', 'oilcooler', 1.1, 340), (30, 'Aluminum Catch Tank', 'misc', 0.5, 120),
    (31, 'Radiator Cap', 'misc', 0.2, 25), (32, 'Street Coilovers', 'susp', 2.5, 900), (33, 'Red Spring Coilovers', 'susp', 3.0, 1200),
    (34, 'Yellow Spring Coilovers', 'susp', 3.4, 1500), (35, 'Black Coilovers', 'susp', 2.8, 1000), (36, 'Damper Set', 'susp', 2.2, 800),
    (37, 'Long-Travel Coilovers', 'susp', 3.0, 1300), (38, 'Purple Coilovers', 'susp', 3.8, 1800), (39, 'Rear Shocks', 'susp', 1.6, 450),
    (40, 'Gas Shock', 'susp', 1.5, 380), (41, 'Front Lower Control Arms', 'arms', 1.5, 500), (42, 'Rear Control Arms', 'arms', 1.5, 520),
    (43, 'Front Knuckles', 'knuckle', 2.2, 900), (44, 'Angle Kit Knuckles', 'knuckle', 2.8, 1400), (45, 'Toe Rod', 'rods', 1.0, 260),
    (46, 'Camber Arm', 'rods', 1.0, 280), (47, 'Adjustable Arm', 'rods', 1.1, 300), (48, 'Traction Rod', 'rods', 1.1, 310),
    (49, 'Tension Rod Pair', 'rods', 1.2, 340), (50, 'Sway Bar Kit', 'sway', 1.5, 420), (51, 'Bent Tension Arm', 'rods', 1.0, 330),
    (52, 'Offset Arm', 'rods', 1.0, 330), (53, 'Drilled Brake Disc', 'disc', 1.2, 480), (54, 'Slotted Brake Disc', 'disc', 1.2, 460),
    (55, 'Red 6-Pot Caliper Kit', 'caliper', 2.4, 1800), (56, 'Gold Caliper Kit', 'caliper', 2.4, 1800), (57, 'Race Brake Pads', 'pads', 0.8, 220),
    (58, 'Red Caliper', 'caliper', 2.0, 1400), (59, 'Street Brake Pads', 'pads', 0.6, 120), (60, 'Sport Brake Pads', 'pads', 0.8, 180),
    (61, 'Drift Brake Pads', 'pads', 1.0, 240), (62, 'Big Brake Disc', 'disc', 1.5, 620), (63, 'Black 5-Spoke Wheel Pair', 'wheels', 1.2, 900),
    (64, 'Gold Mesh Wheel', 'wheels', 1.4, 1100), (65, 'Mesh and Spoke Wheel Set', 'wheels', 1.2, 950), (66, 'White 5-Spoke Wheel', 'wheels', 1.3, 1000),
    (67, 'Grip Tire Stack', 'tires', 2.0, 480), (68, 'Sport Tire Pair', 'tires', 2.6, 640), (69, 'Slick Tire', 'tires', 3.0, 800),
    (70, 'Black Bucket Seat', 'seats', 0.8, 450), (71, 'Red Bucket Seat', 'seats', 0.8, 450), (72, 'Blue Bucket Seat', 'seats', 0.8, 450),
    (73, 'Full Bucket Seat', 'seats', 1.0, 650), (74, 'Racing Seat', 'seats', 1.1, 720), (75, 'Drift Steering Wheel', 'steering', 0.9, 260),
    (76, 'Steering Hub Adapter', 'hub', 0.3, 90), (77, 'Weighted Shift Knob', 'shifter', 0.6, 90), (78, 'Carbon Vented Hood', 'hood', 1.4, 1100),
    (79, 'Carbon Hood', 'hood', 1.2, 950), (80, 'Dual-Vent Hood', 'hood', 1.3, 1000), (81, 'White Front Bumper Kit', 'bumper', 0.8, 900),
    (82, 'Carbon Front Bumper', 'bumper', 1.0, 1100), (83, 'Aero Front Bumper', 'bumper', 0.9, 950), (84, 'Wide Front Bumper', 'bumper', 1.0, 1000),
    (85, 'Wide Fender', 'fender', 1.0, 700), (86, 'GT Wing', 'wing', 1.5, 900), (87, 'Carbon GT Wing', 'wing', 1.6, 1200),
    (88, 'Duck-Tail Spoiler', 'wing', 1.1, 450), (89, 'Low Spoiler', 'wing', 1.0, 400), (90, 'Front Canards', 'canard', 0.6, 300),
    (91, 'Roll Cage', 'cage', 2.5, 2200), (92, 'Vented Front Fender', 'fender', 0.9, 650), (93, 'Red Racing Harness', 'harness', 0.6, 320),
    (94, 'Blue Racing Harness', 'harness', 0.6, 320), (95, 'NOS Bottle', 'nos', 1.8, 1200), (96, 'Side Skirt', 'skirts', 0.6, 500),
    (97, 'Rear Diffuser Lip', 'lip', 0.5, 380), (98, 'White Mirror', 'mirror', 0.1, 80), (99, 'Black Mirror', 'mirror', 0.1, 80),
    (100, 'Smoked Tail Lights', 'lights', 0.2, 260), (101, 'Red Tail Lights', 'lights', 0.2, 260), (102, 'Projector Headlights', 'lights', 0.2, 400),
    (103, 'Seat Base', 'misc', 0.1, 60), (104, 'Fuel Cell', 'fuel', 0.3, 500), (105, 'Japanese License Plate', 'plate', 0.0, 150),
]
assert [x[0] for x in P] == list(range(1, 106))

CAT = {
    'Engine & Turbo': ['turbo', 'engine', 'nos', 'fuel'],
    'Intake & Cooling': ['intake', 'piping', 'intercooler', 'radiator', 'oilcooler', 'misc'],
    'Suspension & Steering': ['susp', 'arms', 'knuckle', 'rods', 'sway', 'steering', 'hub'],
    'Brakes': ['disc', 'caliper', 'pads'],
    'Wheels & Tires': ['wheels', 'tires'],
    'Interior & Safety': ['seats', 'shifter', 'cage', 'harness'],
    'Body & Aero': ['hood', 'bumper', 'fender', 'wing', 'canard', 'skirts', 'lip', 'mirror', 'lights', 'plate'],
}
slot_cat = {s: c for c, ss in CAT.items() for s in ss}

# drift cars: sprite number in cars/jdm-NN.png, make, model, color, base price, drift bonus (names picked by eye from the sheet)
S15, S14, S13, EVO, STI, R33, R34 = ('Nissan', 'Silvia S15'), ('Nissan', 'Silvia S14'), ('Nissan', 'Silvia S13'), ('Mitsubishi', 'Lancer Evolution'), ('Subaru', 'Impreza WRX STI'), ('Nissan', 'Skyline R33'), ('Nissan', 'Skyline R34')
PRICE = {'Silvia S15': 24000, 'Silvia S14': 15000, 'Silvia S13': 12000, 'Lancer Evolution': 26000, 'Impreza WRX STI': 28000, 'Skyline R33': 34000, 'Skyline R34': 52000}
BONUS = {'Silvia S15': 15, 'Silvia S14': 12, 'Silvia S13': 12, 'Lancer Evolution': 8, 'Impreza WRX STI': 8, 'Skyline R33': 9, 'Skyline R34': 9}
rows = [
    [('Nissan', 'Skyline 2000GT', 'white', 28000, 8), ('Nissan', 'Laurel C33', 'black', 9000, 6), ('Toyota', 'Chaser JZX90', 'red', 11000, 9), ('Nissan', 'Cefiro A31', 'white', 7500, 7), ('Nissan', 'Skyline Coupe', 'blue', 15000, 8), ('Mazda', 'Savanna RX-7 FC', 'yellow', 14000, 10)],
    [('Toyota', 'Cresta', 'silver', 8000, 6), ('Toyota', 'AE86 Trueno', 'white', 18000, 14), ('Nissan', 'Silvia S13', 'red', 12000, 12), ('Nissan', 'Silvia S14', 'white', 15000, 12), ('Nissan', 'Skyline R34', 'black', 52000, 9), ('Nissan', 'Silvia S13', 'purple', 12000, 12)],
    [('Nissan', 'Silvia S15', 'blue', 24000, 15), ('Nissan', '180SX', 'white', 16000, 13), ('Mazda', 'RX-7 FD', 'yellow', 32000, 13), ('Subaru', 'Impreza WRX', 'blue', 20000, 7), ('Toyota', 'Mark II JZX100', 'silver', 12500, 9), ('Nissan', 'Skyline GT-R R32', 'red', 38000, 11)],
]
def mk(model, color):
    make, name = model
    return (make, name, color, PRICE[name], BONUS[name])
rows += [
    [mk(S15, 'white'), mk(EVO, 'black'), mk(STI, 'blue'), mk(EVO, 'white'), mk(EVO, 'red'), mk(EVO, 'yellow')],
    [mk(EVO, 'black'), mk(R33, 'silver'), mk(STI, 'blue'), mk(R33, 'white'), mk(R34, 'green'), mk(S15, 'white')],
    [mk(S15, 'red'), mk(S15, 'purple'), mk(R34, 'silver'), mk(STI, 'blue'), mk(S15, 'red'), mk(R34, 'black')],
]
for cols in (['white', 'green', 'yellow', 'white', 'blue', 'silver'], ['red', 'black', 'white', 'blue', 'yellow', 'purple'],
             ['white', 'blue', 'red', 'black', 'silver', 'green'], ['blue', 'white', 'red', 'silver', 'yellow', 'blue']):
    rows.append([mk(S15, c) for c in cols])
cars = []
for r in rows:
    for c in r:
        cars.append(c)
assert len(cars) == 60


def main():
    d = os.path.join(ROOT, 'jdmparts')
    names = [{'n': n, 'file': re.sub(r'[^a-z0-9]+', '-', lab.lower()).strip('-'), 'label': lab} for n, lab, *_ in P]
    json.dump(names, open(os.path.join(d, 'names.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    subprocess.run([sys.executable, '-I', os.path.join(HERE, 'rename_items.py'), d], check=True)
    final = json.load(open(os.path.join(d, 'names.json'), encoding='utf-8'))
    parts = []
    for (n, lab, slot, bonus, pr), f in zip(P, final):
        parts.append({'f': f['file'][:-4], 'n': lab, 's': slot, 'c': slot_cat[slot], 'b': bonus, 'p': pr})
    out = '/* generated by _art-src/make_jdm_catalog.py: do not edit by hand */\nwindow.JDM_CATS = ' + json.dumps(list(CAT.keys())) + ';\nwindow.JDM_PARTS = ' + json.dumps(parts, ensure_ascii=False) + ';\nwindow.JDM_CARS = ' + json.dumps([{'i': i + 1, 'make': c[0], 'model': c[1], 'color': c[2], 'price': c[3], 'db': c[4]} for i, c in enumerate(cars)], ensure_ascii=False) + ';\n'
    open(os.path.join(ROOT, 'jdmmods-data.js'), 'w', encoding='utf-8').write(out)
    print(len(parts), 'parts,', len(cars), 'cars ->', 'jdmmods-data.js')


if __name__ == '__main__':
    main()
