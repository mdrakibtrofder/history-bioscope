// Routes (trade, migration, military, journeys) and schematic empire territories.
// Coordinates are [lat, lng]. Territories are deliberately simplified, approximate outlines.

export const routes = [
  {
    id: 'route-silk-road', name: 'Silk Road', type: 'trade', timeline: 'world', color: '#d97706',
    startYear: -130, endYear: 1450, description: 'Overland trade network linking Han China to the Mediterranean via Central Asia and Persia.',
    relatedEventIds: ['wd-silk-road', 'wd-tang', 'wd-genghis'],
    path: [[34.26, 108.94], [36.06, 103.83], [40.14, 94.66], [39.47, 75.99], [39.65, 66.96], [39.77, 64.42], [37.6, 61.83], [35.69, 51.39], [33.315, 44.366], [33.511, 36.306], [36.2, 36.16], [41.008, 28.978]],
  },
  {
    id: 'route-indian-ocean', name: 'Indian Ocean Maritime Route', type: 'trade', timeline: 'islamic', color: '#0891b2',
    startYear: 800, endYear: 1500, description: 'Monsoon sea lanes connecting East Africa, Arabia, Bengal, Malacca and China.',
    relatedEventIds: ['is-indian-ocean', 'is-ibn-battuta', 'bd-muslin'],
    path: [[-8.96, 39.51], [-4.04, 39.67], [12.78, 45.03], [23.6, 58.5], [27.66, 52.34], [24.86, 67.01], [11.25, 75.78], [6.93, 79.85], [22.336, 91.832], [16.0, 95.0], [2.19, 102.25], [10.8, 106.7], [24.87, 118.68]],
  },
  {
    id: 'route-hijrah', name: 'The Hijrah (622 CE)', type: 'journey', timeline: 'islamic', color: '#059669',
    startYear: 622, endYear: 622, description: 'The Prophet ﷺ and Abu Bakr travelled from Makkah via the Cave of Thawr and the coastal route to Quba and Madinah (approximate path).',
    relatedEventIds: ['is-hijrah'],
    path: [[21.4225, 39.8262], [21.377, 39.85], [21.6, 39.3], [22.3, 39.1], [23.1, 38.9], [23.73, 38.77], [24.2, 39.2], [24.439, 39.617], [24.4672, 39.6111]],
  },
  {
    id: 'route-ibrahim', name: 'Journey of Ibrahim (AS)', type: 'migration', timeline: 'islamic', color: '#7c3aed',
    startYear: -2000, endYear: -1900, description: 'Traditional route: Ur → Harran → Canaan → Egypt → Makkah.',
    relatedEventIds: ['is-ibrahim', 'is-ismail'],
    path: [[30.963, 46.103], [33.0, 44.0], [36.87, 39.03], [35.0, 36.7], [33.5, 36.3], [31.524, 35.11], [30.6, 32.3], [30.0, 31.2], [29.5, 34.9], [26.0, 37.5], [21.4225, 39.8262]],
  },
  {
    id: 'route-exodus', name: 'Exodus of Musa (AS)', type: 'migration', timeline: 'islamic', color: '#7c3aed',
    startYear: -1300, endYear: -1260, description: 'Traditional route from Egypt across the sea to Sinai and towards the Promised Land (route debated).',
    relatedEventIds: ['is-musa'],
    path: [[30.6, 31.8], [30.4, 32.4], [29.9, 32.6], [29.0, 33.3], [28.539, 33.975], [29.5, 34.9], [30.3, 35.4], [31.77, 35.73]],
  },
  {
    id: 'route-ibn-battuta', name: 'Travels of Ibn Battuta', type: 'journey', timeline: 'islamic', color: '#db2777',
    startYear: 1325, endYear: 1354, description: 'Simplified route of the Rihla, including his visit to Bengal in 1346.',
    relatedEventIds: ['is-ibn-battuta', 'bd-ibn-battuta'],
    path: [[35.77, -5.8], [36.75, 3.06], [36.8, 10.18], [31.2, 29.92], [30.044, 31.236], [33.511, 36.306], [24.4672, 39.6111], [21.4225, 39.8262], [33.315, 44.366], [32.657, 51.677], [41.008, 28.978], [39.77, 64.42], [34.53, 69.17], [28.65, 77.23], [11.25, 75.78], [4.17, 73.51], [22.336, 91.832], [24.899, 91.872], [23.647, 90.598], [-6.2, 106.85], [24.87, 118.68]],
  },
  {
    id: 'route-grand-trunk', name: 'Grand Trunk Road', type: 'trade', timeline: 'bangladesh', color: '#b45309',
    startYear: 1540, endYear: 2026, description: 'Ancient highway rebuilt by Sher Shah Suri, from Sonargaon in Bengal to Kabul.',
    relatedEventIds: ['bd-sher-shah'],
    path: [[23.647, 90.598], [24.0, 89.0], [24.87, 88.13], [25.05, 87.84], [25.61, 85.14], [25.32, 82.97], [25.44, 81.85], [27.18, 78.02], [28.65, 77.23], [29.39, 76.97], [30.9, 75.85], [31.592, 74.31], [33.6, 73.05], [34.01, 71.58], [34.53, 69.17]],
  },
  {
    id: 'route-zheng-he', name: 'Voyages of Zheng He', type: 'journey', timeline: 'world', color: '#dc2626',
    startYear: 1405, endYear: 1433, description: 'Ming treasure fleet route through Southeast Asia, Bengal, India, Arabia and East Africa.',
    relatedEventIds: ['wd-zheng-he', 'bd-ghiyasuddin'],
    path: [[32.06, 118.8], [26.07, 119.3], [13.77, 109.22], [2.19, 102.25], [5.0, 97.0], [22.336, 91.832], [6.93, 79.85], [11.25, 75.78], [27.1, 56.4], [12.78, 45.03], [-3.22, 40.12]],
  },
  {
    id: 'route-da-gama', name: 'Vasco da Gama to India', type: 'journey', timeline: 'world', color: '#2563eb',
    startYear: 1497, endYear: 1498, description: 'First European sea voyage around Africa to India.',
    relatedEventIds: ['wd-da-gama'],
    path: [[38.72, -9.14], [28.1, -15.4], [15.0, -23.6], [-10.0, -20.0], [-32.0, 5.0], [-34.36, 18.47], [-33.0, 27.9], [-25.97, 32.57], [-15.0, 40.7], [-3.22, 40.12], [5.0, 60.0], [11.25, 75.78]],
  },
  {
    id: 'route-columbus', name: 'First Voyage of Columbus', type: 'journey', timeline: 'world', color: '#2563eb',
    startYear: 1492, endYear: 1492, description: 'Palos → Canary Islands → the Bahamas.',
    relatedEventIds: ['wd-columbus'],
    path: [[37.23, -6.89], [28.1, -17.1], [26.0, -40.0], [24.05, -74.5]],
  },
  {
    id: 'route-alexander', name: 'Campaign of Alexander the Great', type: 'military', timeline: 'world', color: '#991b1b',
    startYear: -334, endYear: -323, description: 'From Macedon through Persia to the Indus and back to Babylon.',
    relatedEventIds: ['wd-alexander'],
    path: [[40.76, 22.52], [40.2, 27.2], [36.84, 36.2], [33.27, 35.2], [31.2, 29.92], [29.2, 25.5], [36.56, 43.44], [32.542, 44.421], [29.93, 52.89], [36.75, 66.9], [39.65, 66.96], [34.53, 69.17], [32.93, 73.73], [25.4, 68.4], [26.0, 61.0], [29.93, 52.89], [32.542, 44.421]],
  },
  {
    id: 'route-mongol-baghdad', name: 'Hulagu’s Campaign to Baghdad', type: 'military', timeline: 'islamic', color: '#991b1b',
    startYear: 1256, endYear: 1258, description: 'The Ilkhanid Mongol campaign that ended with the sack of Baghdad.',
    relatedEventIds: ['is-baghdad-1258', 'wd-genghis'],
    path: [[47.2, 102.8], [43.8, 87.6], [39.65, 66.96], [37.6, 61.83], [36.4, 50.5], [34.8, 48.51], [33.315, 44.366]],
  },
  {
    id: 'route-umayyad-iberia', name: 'Umayyad Advance into Iberia', type: 'military', timeline: 'islamic', color: '#991b1b',
    startYear: 711, endYear: 732, description: 'From North Africa across Gibraltar to Toledo and into Gaul, halted near Tours (732).',
    relatedEventIds: ['is-andalus'],
    path: [[35.77, -5.8], [36.14, -5.35], [36.6, -5.9], [37.879, -4.779], [39.86, -4.02], [41.65, -0.88], [43.6, 1.44], [44.84, -0.58], [47.0, 0.5]],
  },
  {
    id: 'route-out-of-africa', name: 'Early Human Migration out of Africa', type: 'migration', timeline: 'world', color: '#7c3aed',
    startYear: -70000, endYear: -45000, description: 'Simplified southern dispersal route of modern humans along the coasts of Asia (dates debated).',
    relatedEventIds: [],
    path: [[5.0, 38.0], [12.6, 43.3], [15.0, 50.0], [24.0, 58.0], [25.0, 66.0], [20.0, 73.0], [10.0, 78.0], [22.0, 90.0], [16.0, 95.0], [5.0, 100.0], [-6.0, 106.0], [-8.5, 116.0], [-12.5, 131.0]],
  },
  {
    id: 'route-1971', name: 'Allied Advance on Dhaka (December 1971)', type: 'military', timeline: 'bangladesh', color: '#166534',
    startYear: 1971, endYear: 1971, description: 'Simplified converging thrusts of the joint Indian–Mukti Bahini forces towards Dhaka.',
    relatedEventIds: ['bd-victory', 'bd-sectors'],
    path: [[23.17, 89.21], [23.6, 89.84], [23.711, 90.407], [23.46, 91.18], [24.0, 90.9], [24.899, 91.872], [24.75, 90.4], [23.711, 90.407]],
  },
];

export const territories = [
  {
    id: 'terr-maurya', name: 'Maurya Empire (c. 250 BCE)', empire: 'Maurya Empire', timeline: 'world', color: '#f59e0b',
    startYear: -322, endYear: -185,
    polygon: [[34.5, 69.0], [36.0, 72.5], [33.5, 75.5], [30.5, 79.0], [28.0, 84.0], [27.0, 88.5], [26.0, 92.0], [23.5, 91.5], [22.0, 89.0], [20.0, 86.5], [16.0, 81.0], [13.0, 80.2], [12.5, 77.0], [14.5, 74.0], [20.0, 72.8], [22.5, 69.0], [24.5, 67.0], [25.5, 61.5], [29.0, 61.0], [31.5, 64.0]],
  },
  {
    id: 'terr-roman', name: 'Roman Empire (117 CE)', empire: 'Roman Empire', timeline: 'world', color: '#b91c1c',
    startYear: -27, endYear: 476,
    polygon: [[55.0, -4.5], [54.8, -1.5], [52.5, 1.7], [51.0, 1.5], [51.5, 4.0], [51.8, 6.0], [50.0, 7.5], [48.8, 9.5], [48.3, 13.5], [48.2, 16.5], [47.8, 19.0], [48.0, 22.5], [47.8, 26.0], [45.4, 29.6], [44.6, 33.5], [41.6, 41.6], [41.0, 44.5], [37.5, 44.5], [33.0, 46.5], [30.0, 48.0], [30.5, 46.5], [33.5, 41.0], [31.0, 37.0], [29.5, 35.0], [28.0, 34.4], [24.0, 35.5], [22.0, 33.5], [24.0, 32.6], [29.0, 30.0], [30.5, 25.0], [31.0, 20.0], [30.3, 18.0], [32.5, 14.0], [33.0, 10.5], [34.5, 8.0], [34.5, 1.0], [35.0, -2.0], [34.0, -6.5], [35.8, -6.0], [36.9, -9.0], [43.0, -9.3], [43.5, -1.8], [46.0, -1.3], [48.6, -4.8], [49.7, -1.5], [50.3, -5.5], [51.7, -5.2], [53.5, -4.6]],
  },
  {
    id: 'terr-pala', name: 'Pala Empire (c. 800 CE)', empire: 'Pala Empire', timeline: 'bangladesh', color: '#2563eb',
    startYear: 750, endYear: 1161,
    polygon: [[27.2, 80.0], [27.0, 84.0], [26.8, 88.0], [26.3, 89.9], [25.3, 92.2], [24.0, 91.8], [22.6, 91.7], [21.7, 89.2], [21.6, 87.0], [22.9, 86.0], [24.0, 84.0], [24.5, 81.0], [25.5, 79.5]],
  },
  {
    id: 'terr-rashidun', name: 'Rashidun Caliphate (c. 655 CE)', empire: 'Rashidun Caliphate', timeline: 'islamic', color: '#16a34a',
    startYear: 632, endYear: 661,
    polygon: [[37.0, 36.0], [38.5, 40.0], [40.0, 44.5], [38.5, 48.5], [37.0, 54.0], [37.8, 58.5], [36.5, 61.5], [34.0, 62.5], [30.5, 61.0], [26.0, 61.5], [25.5, 57.0], [22.5, 59.8], [16.8, 52.5], [12.6, 44.0], [16.0, 42.8], [21.0, 39.0], [27.5, 35.0], [28.0, 33.6], [24.0, 32.8], [22.0, 31.3], [24.5, 29.0], [30.0, 25.0], [32.5, 20.0], [32.4, 15.0], [30.5, 19.0], [31.0, 29.5], [31.3, 32.0], [33.0, 34.6], [35.5, 35.8]],
  },
  {
    id: 'terr-umayyad', name: 'Umayyad Caliphate (c. 750 CE)', empire: 'Umayyad Caliphate', timeline: 'islamic', color: '#15803d',
    startYear: 661, endYear: 750,
    polygon: [[43.3, -8.5], [43.4, -2.0], [42.7, 3.0], [41.0, 1.0], [37.0, -1.0], [36.0, -5.5], [35.8, -6.0], [34.0, -6.8], [30.0, -9.6], [29.0, -6.0], [32.0, 0.0], [33.5, 9.0], [32.5, 15.0], [30.5, 19.0], [31.0, 29.5], [31.3, 32.0], [33.0, 34.6], [36.5, 36.0], [37.8, 40.0], [41.0, 43.5], [42.0, 48.0], [39.0, 53.0], [40.0, 59.0], [42.5, 60.0], [43.0, 67.0], [40.5, 71.0], [37.0, 71.5], [34.5, 71.0], [32.0, 73.0], [29.5, 71.5], [24.0, 68.5], [25.2, 61.6], [25.5, 57.0], [22.5, 59.8], [16.8, 52.5], [12.6, 44.0], [16.0, 42.8], [21.0, 39.0], [27.5, 35.0], [28.0, 33.6], [24.0, 32.8], [22.0, 31.3], [24.5, 29.0], [27.0, 15.0], [27.0, 5.0], [28.0, -3.0], [30.0, -9.0]],
  },
  {
    id: 'terr-abbasid', name: 'Abbasid Caliphate (c. 850 CE)', empire: 'Abbasid Caliphate', timeline: 'islamic', color: '#0d9488',
    startYear: 750, endYear: 1258,
    polygon: [[33.5, 9.0], [32.5, 15.0], [30.5, 19.0], [31.0, 29.5], [31.3, 32.0], [33.0, 34.6], [36.5, 36.0], [37.8, 40.0], [41.0, 43.5], [42.0, 48.0], [39.0, 53.0], [40.0, 59.0], [42.5, 60.0], [43.0, 67.0], [40.5, 71.0], [37.0, 71.5], [34.5, 71.0], [32.0, 73.0], [29.5, 71.5], [24.0, 68.5], [25.2, 61.6], [25.5, 57.0], [22.5, 59.8], [16.8, 52.5], [12.6, 44.0], [16.0, 42.8], [21.0, 39.0], [27.5, 35.0], [28.0, 33.6], [24.0, 32.8], [22.0, 31.3], [24.5, 29.0], [27.0, 15.0], [29.0, 10.0]],
  },
  {
    id: 'terr-bengal-sultanate', name: 'Bengal Sultanate (c. 1500 CE)', empire: 'Bengal Sultanate', timeline: 'bangladesh', color: '#1d4ed8',
    startYear: 1352, endYear: 1576,
    polygon: [[26.6, 86.8], [26.6, 88.5], [26.3, 89.9], [26.0, 91.5], [25.2, 92.3], [24.1, 92.3], [22.8, 92.2], [21.2, 92.3], [21.6, 91.8], [22.0, 90.5], [21.6, 89.2], [21.6, 87.4], [22.5, 86.6], [23.8, 86.8], [25.0, 87.0]],
  },
  {
    id: 'terr-mughal', name: 'Mughal Empire (c. 1700 CE)', empire: 'Mughal Empire', timeline: 'islamic', color: '#ea580c',
    startYear: 1526, endYear: 1857,
    polygon: [[34.5, 69.0], [35.5, 71.5], [34.5, 74.5], [32.5, 76.5], [30.5, 79.0], [28.5, 81.5], [27.2, 84.0], [26.6, 88.5], [26.3, 89.9], [26.0, 91.5], [25.0, 92.3], [22.8, 92.2], [22.0, 90.5], [21.6, 89.2], [21.6, 87.4], [19.5, 85.0], [17.0, 82.5], [15.5, 80.2], [13.0, 80.2], [12.5, 78.0], [13.5, 75.0], [15.5, 73.8], [19.0, 72.8], [21.0, 72.6], [22.5, 69.0], [24.5, 67.0], [25.3, 66.0], [28.0, 66.5], [31.0, 66.5], [32.5, 68.0]],
  },
  {
    id: 'terr-ottoman', name: 'Ottoman Empire (1683 CE)', empire: 'Ottoman Empire', timeline: 'islamic', color: '#be123c',
    startYear: 1299, endYear: 1922,
    polygon: [[48.6, 17.0], [48.5, 22.0], [48.0, 26.5], [46.5, 30.0], [46.5, 33.0], [45.3, 36.6], [45.0, 39.0], [43.0, 41.5], [41.5, 42.5], [39.5, 44.0], [37.5, 44.5], [34.0, 46.0], [31.0, 47.5], [29.5, 48.0], [26.0, 50.0], [22.0, 51.0], [21.0, 49.0], [16.0, 43.0], [12.8, 45.0], [15.5, 42.6], [21.0, 39.0], [27.5, 35.0], [24.0, 32.8], [22.0, 31.3], [24.5, 29.0], [30.0, 25.0], [32.5, 20.0], [30.3, 18.0], [32.5, 13.0], [33.5, 10.0], [36.9, 8.6], [36.0, 0.0], [35.0, -1.8], [36.8, 3.0], [37.0, 10.0], [36.0, 15.0], [35.0, 24.0], [37.0, 22.5], [38.0, 20.8], [40.5, 19.5], [42.0, 19.0], [43.5, 16.0], [45.0, 15.8], [46.0, 15.5], [47.8, 16.5]],
  },
  {
    id: 'terr-safavid', name: 'Safavid Empire (c. 1600 CE)', empire: 'Safavid Empire', timeline: 'islamic', color: '#7c3aed',
    startYear: 1501, endYear: 1736,
    polygon: [[41.5, 42.5], [42.0, 47.0], [40.0, 50.0], [38.5, 54.0], [37.8, 58.5], [36.8, 61.5], [35.5, 64.0], [33.0, 66.0], [31.0, 66.5], [29.5, 64.5], [25.5, 61.6], [25.3, 57.3], [27.0, 56.0], [26.5, 54.0], [29.5, 49.5], [31.0, 47.5], [34.0, 46.0], [37.5, 44.5], [39.5, 44.0]],
  },
];
