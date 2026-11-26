import io
p = 'cars.js'
s = io.open(p, encoding='utf-8', newline='').read()

patches = {
    '["Ferrari", "488 Spider", "convertible", 284700],': '["Ferrari", "488 Spider", "convertible", 284700, "ferrari-08-488-spider-blue", "blue"],',
    '["Bugatti", "Chiron", "coupe", 2986871],': '["Bugatti", "Chiron", "coupe", 2986871, "exotic-07-chiron-gold", "gold"],',
    '["Ferrari", "812 Superfast", "coupe", 315480],': '["Ferrari", "812 Superfast", "coupe", 315480, "ferrari-04-812-gray", "gray"],',
    '["Lamborghini", "Huracan", "coupe", 203291],': '["Lamborghini", "Huracan", "coupe", 203291, "exotic-12-huracan-purple", "purple"],',
    '["Mercedes-Benz", "AMG GT", "coupe", 112400],': '["Mercedes-Benz", "AMG GT", "coupe", 112400, "mercedes-01-amg-gt-silver", "silver"],',
    '["Nissan", "GT-R Nismo", "coupe", 214750],': '["Nissan", "GT-R Nismo", "coupe", 214750, "exotic-04-gtr-gray", "gray"],',
    '["Kia", "K5", "sedan", 26690],': '["Kia", "K5", "sedan", 26690, "modest-01-k5-white", "white"],',
    '["Honda", "Accord", "sedan", 23579],': '["Honda", "Accord", "sedan", 23579, "modest-02-accord-blue", "blue"],',
    '["Nissan", "Altima", "sedan", 23260],': '["Nissan", "Altima", "sedan", 23260, "modest-04-altima-white", "white"],',
    '["Mazda", "Mazda6", "sedan", 21951],': '["Mazda", "Mazda6", "sedan", 21951, "modest-06-mazda6-red", "red"],',
    '["Toyota", "Camry", "sedan", 23654],': '["Toyota", "Camry", "sedan", 23654, "modest-07-camry-silver", "silver"],',
    '["Toyota", "Corolla", "sedan", 18673],': '["Toyota", "Corolla", "sedan", 18673, "modest-09-corolla-gray", "gray"],',
    '["Cadillac", "Escalade", "suv", 74695],': '["Cadillac", "Escalade", "suv", 74695, "cadillac-03-escalade-black", "black"],',
    '["Lamborghini", "Urus", "suv", 201893],': '["Lamborghini", "Urus", "suv", 201893, "exotic-01-urus-green", "green"],',
    '["Mercedes-Benz", "G Wagon", "4x4", 142741],': '["Mercedes-Benz", "G Wagon", "4x4", 142741, "mercedes-02-g-class-black", "black"],',
    '["Cadillac", "CT5-V", "sedan", 51395],': '["Cadillac", "CT5-V", "sedan", 51395, "cadillac-01-ct5-black", "black"],',
    '["Rolls-Royce", "Ghost", "sedan", 348500],': '["Rolls-Royce", "Ghost", "sedan", 348500, "exotic-05-ghost-black", "black"],',
    '["Ferrari", "SF90 Stradale", "coupe", 524815],': '["Ferrari", "SF90 Stradale", "coupe", 524815, "ferrari-09-sf90-yellow", "yellow"],',
    '["McLaren", "750S", "coupe", 324000],': '["McLaren", "750S", "coupe", 324000, "exotic-06-mclaren-blue", "blue"],',
    '["Mercedes-Benz", "C-Class", "sedan", 43550],': '["Mercedes-Benz", "C-Class", "sedan", 43550, "mercedes-03-c-class-white", "white"],',
    '["Porsche", "911", "coupe", 106100],': '["Porsche", "911", "coupe", 106100, "exotic-08-gt3rs-white", "white"],',
}
for old, new in patches.items():
    assert old in s, old
    s = s.replace(old, new, 1)

regular = '''
    ["Alfa Romeo", "Giulia Quadrifoglio", "sedan", 82000, "exotic-02-giulia-white", "white"],
    ["Dodge", "Challenger SRT Hellcat", "coupe", 72000, "exotic-11-challenger-black", "black"],
    ["Hyundai", "Sonata", "sedan", 28000, "modest-03-sonata-gray", "gray"],
    ["BMW", "3 Series", "sedan", 45000, "modest-05-3series-blue", "blue"],
    ["Honda", "Civic Sedan", "sedan", 24000, "modest-08-civic-white", "white"],
    ["Nissan", "Sentra", "sedan", 22000, "modest-10-sentra-white", "white"],
    ["Honda", "Accord Sport", "sedan", 29000, "modest-11-accord-blue", "blue"],
    ["Kia", "K5 GT", "sedan", 32000, "modest-12-k5-red", "red"],
    ["Cadillac", "CT4", "sedan", 37000, "cadillac-02-ct4-white", "white"],
    ["Cadillac", "CT5 Premium", "sedan", 48000, "cadillac-04-ct5-silver", "silver"],
    ["Cadillac", "CT6", "sedan", 62000, "cadillac-05-ct6-blue", "blue"],
    ["Cadillac", "Escalade Premium", "suv", 92000, "cadillac-06-escalade-white", "white"],
    ["Cadillac", "CT5 Luxury", "sedan", 46000, "cadillac-07-ct5-burgundy", "burgundy"],
    ["Cadillac", "Escalade Sport", "suv", 95000, "cadillac-08-escalade-black", "black"],
    ["Cadillac", "CT4 Luxury", "sedan", 39000, "cadillac-09-ct4-white", "white"],
    ["Cadillac", "CT5 Sport", "sedan", 50000, "cadillac-10-ct5-gray", "gray"],
    ["Cadillac", "CT6 Platinum", "sedan", 70000, "cadillac-11-ct6-gold", "gold"],
    ["Cadillac", "XT4", "suv", 39000, "cadillac-12-xt4-white", "white"],
    ["Mercedes-Benz", "AMG GT R", "coupe", 165000, "mercedes-04-amg-gt-red", "red"],
    ["Mercedes-Benz", "AMG GT Stealth", "coupe", 150000, "mercedes-05-amg-gt-green", "green"],
    ["Mercedes-Benz", "C-Class Coupe", "coupe", 52000, "mercedes-06-c-class-blue", "blue"],
    ["Mercedes-Benz", "S-Class", "sedan", 115000, "mercedes-07-s-class-black", "black"],
    ["Mercedes-Benz", "GLE", "suv", 65000, "mercedes-08-gle-white", "white"],
    ["Mercedes-Benz", "AMG GT Violet", "coupe", 170000, "mercedes-09-amg-gt-purple", "purple"],
    ["Mercedes-Benz", "A-Class", "hatchback", 38000, "mercedes-10-a-class-lime", "green"],
    ["Mercedes-Benz", "SL", "convertible", 110000, "mercedes-11-sl-gray", "gray"],
    ["Mercedes-Benz", "Metris", "minivan", 42000, "mercedes-12-metris-gold", "gold"],
'''

luxury = '''
    ["Ferrari", "458 Italia", "coupe", 250000, "ferrari-01-458-red", "red"],
    ["Ferrari", "488 GTB", "coupe", 280000, "exotic-03-458-red", "red"],
    ["Ferrari", "F8 Tributo", "coupe", 285000, "ferrari-02-f8-yellow", "yellow"],
    ["Ferrari", "488 Pista", "coupe", 350000, "ferrari-03-488-pista-red", "red"],
    ["Ferrari", "F430", "coupe", 180000, "ferrari-05-f430-red", "red"],
    ["Ferrari", "458 Speciale", "coupe", 320000, "ferrari-06-458-speciale-white", "white"],
    ["Ferrari", "LaFerrari", "coupe", 1500000, "ferrari-07-laferrari-red", "red"],
    ["Ferrari", "Enzo", "coupe", 2500000, "ferrari-10-enzo-black", "black"],
    ["Ferrari", "Testarossa", "coupe", 150000, "ferrari-11-testarossa-red", "red"],
    ["Ferrari", "308 GTS", "coupe", 90000, "ferrari-12-308-white", "white"],
    ["Audi", "R8 V10", "coupe", 160000, "exotic-09-r8-white", "white"],
    ["Aston Martin", "Vantage", "coupe", 190000, "exotic-10-vantage-green", "green"],
    ["Porsche", "911 GT3 RS", "coupe", 241000, "exotic-08-gt3rs-white", "white"],
'''

anchor = '  ]),\n  (window.EXTENDED_CARS'
assert anchor in s
s = s.replace(anchor, regular.strip('\n') + '\n' + anchor, 1)

anchor2 = '  ]),\n  (window.REAL_CAR_PRICES'
assert anchor2 in s
s = s.replace(anchor2, luxury.strip('\n') + '\n' + anchor2, 1)

io.open(p, 'w', encoding='utf-8', newline='').write(s)
print('cars patched')
