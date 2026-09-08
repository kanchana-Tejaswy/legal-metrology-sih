import bcrypt from 'bcryptjs';
import { isSupabaseConfigured, supabase } from '../config/supabase.js';

// Pre-hashed password for DemoPassword@2026
const DEMO_PASSWORD_HASH = bcrypt.hashSync('DemoPassword@2026', 10);

// In-Memory Resilient DB Store preloaded with seed records
const memoryDb = {

  // ─── MASTER DATA: India States & Districts ───────────────────────────────
  states: [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    // Union Territories
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ],

  districts: {
    'Andhra Pradesh': [
      'Alluri Sitharama Raju', 'Anakapalli', 'Anantapur', 'Annamayya', 'Bapatla',
      'Chittoor', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru',
      'Guntur', 'Kakinada', 'Krishna', 'Kurnool', 'Nandyal', 'NTR', 'Palnadu',
      'Parvathipuram Manyam', 'Prakasam', 'Sri Potti Sriramulu Nellore',
      'Sri Sathya Sai', 'Srikakulam', 'Tirupati', 'Visakhapatnam',
      'Vizianagaram', 'West Godavari', 'YSR Kadapa'
    ],
    'Arunachal Pradesh': [
      'Anjaw', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang',
      'Itanagar Capital Complex', 'Kamle', 'Kra Daadi', 'Kurung Kumey',
      'Lepa Rada', 'Lohit', 'Longding', 'Lower Dibang Valley', 'Lower Siang',
      'Lower Subansiri', 'Namsai', 'Pakke-Kessang', 'Papum Pare', 'Shi Yomi',
      'Siang', 'Tawang', 'Tirap', 'Upper Dibang Valley', 'Upper Siang',
      'Upper Subansiri', 'West Kameng', 'West Siang'
    ],
    'Assam': [
      'Bajali', 'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar',
      'Charaideo', 'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh',
      'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat',
      'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar',
      'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar',
      'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'
    ],
    'Bihar': [
      'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur',
      'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj',
      'Jamui', 'Jehanabad', 'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj',
      'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda',
      'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran',
      'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali',
      'West Champaran'
    ],
    'Chhattisgarh': [
      'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur',
      'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi',
      'Janjgir-Champa', 'Jashpur', 'Kabirdham', 'Kanker', 'Khairagarh-Chhuikhadan-Gandai',
      'Kondagaon', 'Korba', 'Koriya', 'Mahasamund', 'Manendragarh-Chirmiri-Bharatpur',
      'Mohla-Manpur-Ambagarh Chowki', 'Mungeli', 'Narayanpur', 'Raigarh',
      'Raipur', 'Rajnandgaon', 'Sakti', 'Sarangarh-Bilaigarh', 'Sukma', 'Surajpur',
      'Surguja'
    ],
    'Goa': ['North Goa', 'South Goa'],
    'Gujarat': [
      'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch',
      'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka',
      'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch',
      'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal',
      'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar',
      'Tapi', 'Vadodara', 'Valsad'
    ],
    'Haryana': [
      'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram',
      'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh',
      'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa',
      'Sonipat', 'Yamunanagar'
    ],
    'Himachal Pradesh': [
      'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul and Spiti',
      'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'
    ],
    'Jharkhand': [
      'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum',
      'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti',
      'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi',
      'Sahebganj', 'Seraikela Kharsawan', 'Simdega', 'West Singhbhum'
    ],
    'Karnataka': [
      'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban',
      'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga',
      'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri',
      'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur',
      'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada',
      'Vijayapura', 'Yadgir'
    ],
    'Kerala': [
      'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam',
      'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta',
      'Thiruvananthapuram', 'Thrissur', 'Wayanad'
    ],
    'Madhya Pradesh': [
      'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani',
      'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara',
      'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda',
      'Hoshangabad', 'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa',
      'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch',
      'Niwari', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar',
      'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri',
      'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha'
    ],
    'Maharashtra': [
      'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara',
      'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli',
      'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburb',
      'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar',
      'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara',
      'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
    ],
    'Manipur': [
      'Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West',
      'Jiribam', 'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl',
      'Senapati', 'Tamenglong', 'Tengnoupal', 'Thoubal', 'Ukhrul'
    ],
    'Meghalaya': [
      'East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'Eastern West Khasi Hills',
      'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills',
      'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'
    ],
    'Mizoram': [
      'Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib', 'Lawngtlai',
      'Lunglei', 'Mamit', 'Saiha', 'Saitual', 'Serchhip'
    ],
    'Nagaland': [
      'Chumoukedima', 'Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung',
      'Mon', 'Niuland', 'Noklak', 'Peren', 'Phek', 'Shamator', 'Tseminyu',
      'Tuensang', 'Wokha', 'Zunheboto'
    ],
    'Odisha': [
      'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh',
      'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur',
      'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar',
      'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh',
      'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundergarh'
    ],
    'Punjab': [
      'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib',
      'Fazilka', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala',
      'Ludhiana', 'Malerkotla', 'Mansa', 'Moga', 'Mohali', 'Muktsar',
      'Pathankot', 'Patiala', 'Rupnagar', 'Sangrur', 'Shahid Bhagat Singh Nagar',
      'Tarn Taran'
    ],
    'Rajasthan': [
      'Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara',
      'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur',
      'Ganganagar', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar',
      'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh',
      'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Tonk', 'Udaipur'
    ],
    'Sikkim': ['East Sikkim', 'North Sikkim', 'Pakyong', 'Soreng', 'South Sikkim', 'West Sikkim'],
    'Tamil Nadu': [
      'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
      'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram',
      'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
      'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
      'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi',
      'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
      'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur',
      'Vellore', 'Viluppuram', 'Virudhunagar'
    ],
    'Telangana': [
      'Adilabad', 'Bhadradri Kothagudem', 'Hanumakonda', 'Hyderabad', 'Jagtial',
      'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy',
      'Karimnagar', 'Khammam', 'Kumuram Bheem Asifabad', 'Mahabubabad',
      'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu',
      'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad',
      'Peddapalli', 'Rajanna Sircilla', 'Ranga Reddy', 'Sangareddy', 'Siddipet',
      'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'
    ],
    'Tripura': [
      'Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala',
      'South Tripura', 'Unakoti', 'West Tripura'
    ],
    'Uttar Pradesh': [
      'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya',
      'Ayodhya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur',
      'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor',
      'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah',
      'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar',
      'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur',
      'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj',
      'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kushinagar',
      'Lakhimpur Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba',
      'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad',
      'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Prayagraj', 'Raebareli',
      'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur',
      'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra',
      'Sultanpur', 'Unnao', 'Varanasi'
    ],
    'Uttarakhand': [
      'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar',
      'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal',
      'Udham Singh Nagar', 'Uttarkashi'
    ],
    'West Bengal': [
      'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur',
      'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong',
      'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas',
      'Paschim Bardhaman', 'Paschim Medinipur', 'Purba Bardhaman', 'Purba Medinipur',
      'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'
    ],
    'Andaman and Nicobar Islands': [
      'Nicobar', 'North and Middle Andaman', 'South Andaman'
    ],
    'Chandigarh': ['Chandigarh'],
    'Dadra and Nagar Haveli and Daman and Diu': [
      'Dadra and Nagar Haveli', 'Daman', 'Diu'
    ],
    'Delhi': [
      'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi',
      'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi',
      'South West Delhi', 'West Delhi'
    ],
    'Jammu and Kashmir': [
      'Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal',
      'Jammu', 'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama',
      'Rajouri', 'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur'
    ],
    'Ladakh': ['Kargil', 'Leh'],
    'Lakshadweep': ['Lakshadweep'],
    'Puducherry': ['Karaikal', 'Mahe', 'Puducherry', 'Yanam']
  },

  users: [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      email: 'admin@legalmetrology.demo',
      password_hash: DEMO_PASSWORD_HASH,
      role: 'ADMIN',
      status: 'APPROVED',
      full_name: 'Dr. Rajeshwar Verma, IAS',
      phone: '+91 98100 12345',
      created_at: new Date('2026-01-01T09:00:00Z').toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000001',
      email: 'owner@business.demo',
      password_hash: DEMO_PASSWORD_HASH,
      role: 'OWNER',
      status: 'APPROVED',
      full_name: 'Anand Kumar',
      phone: '+91 98201 54321',
      created_at: new Date('2026-01-10T10:00:00Z').toISOString()
    },
    {
      id: 'b0000000-0000-0000-0000-000000000002',
      email: 'newapplicant@traders.demo',
      password_hash: DEMO_PASSWORD_HASH,
      role: 'OWNER',
      status: 'PENDING',
      full_name: 'Suresh Patel',
      phone: '+91 98450 67890',
      created_at: new Date('2026-02-01T14:30:00Z').toISOString()
    },
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      email: 'lmo@legalmetrology.demo',
      password_hash: DEMO_PASSWORD_HASH,
      role: 'LMO',
      status: 'APPROVED',
      full_name: 'R. Sharma, Inspector LM',
      phone: '+91 94120 11223',
      created_at: new Date('2026-01-05T08:00:00Z').toISOString()
    },
    {
      id: 'd0000000-0000-0000-0000-000000000001',
      email: 'gatc@testcentre.demo',
      password_hash: DEMO_PASSWORD_HASH,
      role: 'GATC',
      status: 'APPROVED',
      full_name: 'Metro Metrology & Testing Lab',
      phone: '+91 98111 88990',
      created_at: new Date('2026-01-08T11:00:00Z').toISOString()
    }
  ],

  stakeholders: [
    {
      id: 's0000000-0000-0000-0000-000000000001',
      user_id: 'b0000000-0000-0000-0000-000000000001',
      business_name: 'ABC Supermarket & Retailers Ltd.',
      business_address: 'Plot No. 42, Commercial Zone, Sector 18',
      state: 'Maharashtra',
      district: 'Mumbai Suburb',
      pincode: '400053',
      trade_license_no: 'TRD-MUM-2024-8841',
      gstin: '27AABCU9603R1ZM',
      supporting_documents: [
        { name: 'Trade_License_Certificate.pdf', url: '/uploads/sample_license.pdf' },
        { name: 'GST_Registration_Certificate.pdf', url: '/uploads/sample_gst.pdf' }
      ],
      review_notes: 'Verified trade registration and valid premises lease agreement.',
      reviewed_by: 'a0000000-0000-0000-0000-000000000001',
      reviewed_at: new Date('2026-01-11T12:00:00Z').toISOString()
    },
    {
      id: 's0000000-0000-0000-0000-000000000002',
      user_id: 'b0000000-0000-0000-0000-000000000002',
      business_name: 'Sri Lakshmi Traders',
      business_address: 'Shop No. 12, APMC Grain Market',
      state: 'Telangana',
      district: 'Hyderabad',
      pincode: '500012',
      trade_license_no: 'TRD-HYD-2026-1092',
      gstin: '36AAACL2901P1ZN',
      supporting_documents: [
        { name: 'Shop_Establishment_Certificate.pdf', url: '/uploads/sample_shop.pdf' }
      ],
      review_notes: null,
      reviewed_by: null,
      reviewed_at: null
    }
  ],

  lmo_profiles: [
    {
      id: 'lp000000-0000-0000-0000-000000000001',
      user_id: 'c0000000-0000-0000-0000-000000000001',
      officer_code: 'LMO-MH-DIV03',
      designation: 'Senior Inspector of Legal Metrology',
      jurisdiction_zone: 'Mumbai Division - Zone 3',
      office_address: 'Legal Metrology Bhavan, Bandra Kurla Complex, Mumbai'
    }
  ],

  gatc_profiles: [
    {
      id: 'gp000000-0000-0000-0000-000000000001',
      user_id: 'd0000000-0000-0000-0000-000000000001',
      centre_name: 'Metro Metrology & Testing Services',
      authorization_no: 'GATC-GOI-W-2023-049',
      authorized_scope: ['EWS', 'PWS', 'PCS'],
      lab_address: 'MIDC Industrial Area, Unit 7B, Andheri East, Mumbai',
      contact_person: 'Praveen Nair (Technical Director)',
      valid_until: '2028-03-31'
    }
  ],

  categories: [
    {
      id: '11111111-1111-1111-1111-111111111001',
      code: 'EWS',
      name: 'Electronic Weighing Scale (Countertop)',
      description: 'Non-automatic weighing instruments for commercial retail transactions up to 30 kg',
      verification_cycle_months: 12,
      accuracy_class: 'Class III',
      standard_fee: 450.00,
      gatc_eligible: true
    },
    {
      id: '11111111-1111-1111-1111-111111111002',
      code: 'PWS',
      name: 'Platform Weighing Scale',
      description: 'Heavy duty platform scales for warehouses and wholesale trade up to 500 kg',
      verification_cycle_months: 12,
      accuracy_class: 'Class III',
      standard_fee: 850.00,
      gatc_eligible: true
    },
    {
      id: '11111111-1111-1111-1111-111111111003',
      code: 'PCS',
      name: 'Price Computing Scale',
      description: 'Electronic retail scales with automatic price computation and thermal print receipt',
      verification_cycle_months: 12,
      accuracy_class: 'Class III',
      standard_fee: 600.00,
      gatc_eligible: true
    },
    {
      id: '11111111-1111-1111-1111-111111111004',
      code: 'WB',
      name: 'Electronic Weighbridge (Pitless / Pit)',
      description: 'Heavy capacity vehicle weighing bridge up to 100 tonnes',
      verification_cycle_months: 24,
      accuracy_class: 'Class IV',
      standard_fee: 4500.00,
      gatc_eligible: false
    },
    {
      id: '11111111-1111-1111-1111-111111111005',
      code: 'FPM',
      name: 'Fuel Dispensing Unit (Petrol/Diesel)',
      description: 'Measuring pumps for petroleum dispensing with calibrated meter unit',
      verification_cycle_months: 12,
      accuracy_class: 'Class 0.5',
      standard_fee: 1200.00,
      gatc_eligible: false
    }
  ],

  instruments: [
    {
      id: 'e0000000-0000-0000-0000-000000000001',
      owner_id: 'b0000000-0000-0000-0000-000000000001',
      category_id: '11111111-1111-1111-1111-111111111001',
      instrument_type: 'Electronic Weighing Scale (Countertop)',
      manufacturer: 'Avery Weigh-Tronix',
      model_number: 'AWT-30D',
      serial_number: 'SN-2024-EWS-8901',
      max_capacity: 30.0000,
      min_capacity: 0.1000,
      unit: 'kg',
      verification_scale_interval: 0.0050,
      location: 'Checkout Counter 1, ABC Supermarket, Bandra West, Mumbai',
      description: 'Digital counter balance with dual LED customer display',
      photograph_url: null,
      current_status: 'VALID',
      created_at: new Date('2026-01-15T10:00:00Z').toISOString()
    },
    {
      id: 'e0000000-0000-0000-0000-000000000002',
      owner_id: 'b0000000-0000-0000-0000-000000000001',
      category_id: '11111111-1111-1111-1111-111111111002',
      instrument_type: 'Platform Weighing Scale',
      manufacturer: 'Essae Teraoka',
      model_number: 'DS-215',
      serial_number: 'SN-2024-PWS-4412',
      max_capacity: 300.0000,
      min_capacity: 2.0000,
      unit: 'kg',
      verification_scale_interval: 0.0500,
      location: 'Goods Receiving Dock 2, ABC Supermarket, Mumbai',
      description: 'Heavy duty low profile warehouse platform scale',
      photograph_url: null,
      current_status: 'EXPIRING_SOON',
      created_at: new Date('2026-01-20T11:00:00Z').toISOString()
    },
    {
      id: 'e0000000-0000-0000-0000-000000000003',
      owner_id: 'b0000000-0000-0000-0000-000000000001',
      category_id: '11111111-1111-1111-1111-111111111003',
      instrument_type: 'Price Computing Scale',
      manufacturer: 'CAS India Corp',
      model_number: 'PR-PLUS',
      serial_number: 'SN-2023-PCS-1029',
      max_capacity: 15.0000,
      min_capacity: 0.0400,
      unit: 'kg',
      verification_scale_interval: 0.0020,
      location: 'Produce Section, ABC Supermarket, Mumbai',
      description: 'Weighing scale with thermal barcode sticker printer',
      photograph_url: null,
      current_status: 'EXPIRED',
      created_at: new Date('2025-01-10T09:00:00Z').toISOString()
    },
    {
      id: 'e0000000-0000-0000-0000-000000000004',
      owner_id: 'b0000000-0000-0000-0000-000000000001',
      category_id: '11111111-1111-1111-1111-111111111001',
      instrument_type: 'Electronic Weighing Scale (Countertop)',
      manufacturer: 'Mettler Toledo',
      model_number: 'bPlus-T2',
      serial_number: 'SN-2026-EWS-7741',
      max_capacity: 15.0000,
      min_capacity: 0.0400,
      unit: 'kg',
      verification_scale_interval: 0.0020,
      location: 'Deli & Bakery Section, ABC Supermarket, Mumbai',
      description: 'New high accuracy touch price computing counter scale',
      photograph_url: null,
      current_status: 'PENDING',
      created_at: new Date('2026-02-01T15:00:00Z').toISOString()
    }
  ],

  applications: [
    {
      id: 'LM-APP-2026-000101',
      owner_id: 'b0000000-0000-0000-0000-000000000001',
      instrument_id: 'e0000000-0000-0000-0000-000000000001',
      application_type: 'NEW',
      preferred_date: '2026-02-10',
      preferred_time: '10:30 AM',
      remarks: 'Initial stamping and verification after installation at new counter',
      status: 'COMPLETED',
      documents: [{ name: 'Invoice.pdf', url: '/uploads/invoice.pdf' }],
      created_at: new Date('2026-02-01T10:00:00Z').toISOString(),
      updated_at: new Date('2026-02-10T12:00:00Z').toISOString()
    },
    {
      id: 'LM-APP-2026-000102',
      owner_id: 'b0000000-0000-0000-0000-000000000001',
      instrument_id: 'e0000000-0000-0000-0000-000000000002',
      application_type: 'RE_VERIFICATION',
      preferred_date: '2026-09-15',
      preferred_time: '02:00 PM',
      remarks: 'Annual re-verification application before certificate expiration',
      status: 'SCHEDULED',
      documents: [{ name: 'Previous_Cert.pdf', url: '/uploads/prev_cert.pdf' }],
      created_at: new Date('2026-09-01T11:00:00Z').toISOString(),
      updated_at: new Date('2026-09-02T16:00:00Z').toISOString()
    },
    {
      id: 'LM-APP-2026-000103',
      owner_id: 'b0000000-0000-0000-0000-000000000001',
      instrument_id: 'e0000000-0000-0000-0000-000000000004',
      application_type: 'NEW',
      preferred_date: '2026-09-18',
      preferred_time: '11:00 AM',
      remarks: 'New counter installation testing at GATC accredited lab',
      status: 'ASSIGNED',
      documents: [{ name: 'Factory_Calibration.pdf', url: '/uploads/factory.pdf' }],
      created_at: new Date('2026-09-03T09:30:00Z').toISOString(),
      updated_at: new Date('2026-09-04T14:20:00Z').toISOString()
    }
  ],

  assignments: [
    {
      id: 'f0000000-0000-0000-0000-000000000001',
      application_id: 'LM-APP-2026-000101',
      verifier_type: 'LMO',
      verifier_id: 'c0000000-0000-0000-0000-000000000001',
      assigned_by: 'a0000000-0000-0000-0000-000000000001',
      assigned_date: '2026-02-05T10:00:00Z',
      notes: 'Assigned to Ward Inspector for on-site physical verification',
      is_active: true
    },
    {
      id: 'f0000000-0000-0000-0000-000000000002',
      application_id: 'LM-APP-2026-000102',
      verifier_type: 'LMO',
      verifier_id: 'c0000000-0000-0000-0000-000000000001',
      assigned_by: 'a0000000-0000-0000-0000-000000000001',
      assigned_date: '2026-09-02T11:00:00Z',
      notes: 'Assigned to Inspector R. Sharma for scheduled annual re-stamping',
      is_active: true
    },
    {
      id: 'f0000000-0000-0000-0000-000000000003',
      application_id: 'LM-APP-2026-000103',
      verifier_type: 'GATC',
      verifier_id: 'd0000000-0000-0000-0000-000000000001',
      assigned_by: 'a0000000-0000-0000-0000-000000000001',
      assigned_date: '2026-09-04T12:00:00Z',
      notes: 'Allocated to GATC Metro Lab under accredited scope EWS',
      is_active: true
    }
  ],

  schedules: [
    {
      id: 'f1000000-0000-0000-0000-000000000001',
      application_id: 'LM-APP-2026-000101',
      scheduled_date: '2026-02-10',
      scheduled_time: '10:30 AM',
      location: 'Plot No. 42, Commercial Zone, Sector 18, Mumbai',
      verifier_id: 'c0000000-0000-0000-0000-000000000001',
      status: 'COMPLETED'
    },
    {
      id: 'f1000000-0000-0000-0000-000000000002',
      application_id: 'LM-APP-2026-000102',
      scheduled_date: '2026-09-15',
      scheduled_time: '02:00 PM',
      location: 'Dock 2, Plot No. 42, Sector 18, Mumbai',
      verifier_id: 'c0000000-0000-0000-0000-000000000001',
      status: 'SCHEDULED'
    },
    {
      id: 'f1000000-0000-0000-0000-000000000003',
      application_id: 'LM-APP-2026-000103',
      scheduled_date: '2026-09-18',
      scheduled_time: '11:00 AM',
      location: 'MIDC Industrial Area, Unit 7B, Andheri East, Mumbai',
      verifier_id: 'd0000000-0000-0000-0000-000000000001',
      status: 'SCHEDULED'
    }
  ],

  verification_records: [
    {
      id: 'f2000000-0000-0000-0000-000000000001',
      application_id: 'LM-APP-2026-000101',
      instrument_id: 'e0000000-0000-0000-0000-000000000001',
      verifier_id: 'c0000000-0000-0000-0000-000000000001',
      verifier_role: 'LMO',
      inspection_date: '2026-02-10T11:15:00Z',
      visual_checklist: {
        stamping_intact: true,
        spirit_level_centered: true,
        plate_condition_clean: true,
        zero_tracking_functional: true
      },
      metrological_tests: {
        repeatability_error_g: 0.001,
        eccentricity_error_g: 0.001,
        max_load_test_kg: 30,
        error_at_max_load_g: 0.002,
        max_permissible_error_g: 0.005
      },
      observations: 'Physical and metrological verification carried out using Standard Working Weights F2 Class. Zero return verified. Repeatability test over 10 consecutive cycles satisfactory.',
      test_results: 'Max load deviation +2g at 30kg, well within Maximum Permissible Error (MPE +/- 5g). Eccentricity test across 4 quadrants passed.',
      evidence_photos: [
        { name: 'Lead_Seal_MH2026.jpg', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60' }
      ],
      remarks: 'Lead verification seal applied at rear calibration port (Seal Tag No: MH/MUM/2026/0912). Instrument verified fit for commercial use.',
      result: 'PASS',
      created_at: '2026-02-10T11:30:00Z'
    }
  ],

  certificates: [
    {
      id: 'CERT-2026-000101',
      verification_record_id: 'f2000000-0000-0000-0000-000000000001',
      instrument_id: 'e0000000-0000-0000-0000-000000000001',
      owner_id: 'b0000000-0000-0000-0000-000000000001',
      verifier_id: 'c0000000-0000-0000-0000-000000000001',
      verifying_authority: 'Legal Metrology Department, Government of Maharashtra',
      verifier_name: 'R. Sharma (Senior Inspector)',
      verification_date: '2026-02-10',
      valid_until: '2027-02-09',
      status: 'VALID',
      qr_verification_url: '/verify/CERT-2026-000101',
      digital_signature_hash: 'SHA256:d8a57e3f940b5c192d4e84b2c8901f41e5a87b1c3d2e9f0a7b4c6d8e0f1a3b5c',
      pdf_url: null,
      revocation_reason: null,
      revoked_at: null,
      revoked_by: null,
      created_at: '2026-02-10T11:35:00Z',
      updated_at: '2026-02-10T11:35:00Z'
    },
    {
      id: 'CERT-2025-000088',
      verification_record_id: 'f2000000-0000-0000-0000-000000000001',
      instrument_id: 'e0000000-0000-0000-0000-000000000003',
      owner_id: 'b0000000-0000-0000-0000-000000000001',
      verifier_id: 'c0000000-0000-0000-0000-000000000001',
      verifying_authority: 'Legal Metrology Department, Government of Maharashtra',
      verifier_name: 'R. Sharma (Senior Inspector)',
      verification_date: '2025-01-10',
      valid_until: '2026-01-09', // Expired in the past
      status: 'EXPIRED',
      qr_verification_url: '/verify/CERT-2025-000088',
      digital_signature_hash: 'SHA256:bb71904a180371a53b01850123efdca8203c98305886616b7617b4c092003881',
      pdf_url: null,
      revocation_reason: null,
      revoked_at: null,
      revoked_by: null,
      created_at: '2025-01-10T11:00:00Z',
      updated_at: '2026-01-10T00:00:00Z'
    }
  ],

  notifications: [
    {
      id: 'n0000000-0000-0000-0000-000000000001',
      user_id: 'b0000000-0000-0000-0000-000000000001',
      title: 'Verification Certificate Issued',
      message: 'Official Legal Metrology Certificate CERT-2026-000101 has been issued for Electronic Weighing Scale (SN-2024-EWS-8901).',
      type: 'INFO',
      related_entity_type: 'CERTIFICATE',
      related_entity_id: 'CERT-2026-000101',
      is_read: false,
      created_at: '2026-02-10T12:00:00Z'
    },
    {
      id: 'n0000000-0000-0000-0000-000000000002',
      user_id: 'b0000000-0000-0000-0000-000000000001',
      title: 'Certificate Expiring Soon (30 Days Notice)',
      message: 'Certificate for Platform Scale (SN-2024-PWS-4412) is approaching expiration. Please submit re-verification application.',
      type: 'EXPIRY',
      related_entity_type: 'INSTRUMENT',
      related_entity_id: 'e0000000-0000-0000-0000-000000000002',
      is_read: false,
      created_at: '2026-09-01T09:00:00Z'
    },
    {
      id: 'n0000000-0000-0000-0000-000000000003',
      user_id: 'b0000000-0000-0000-0000-000000000001',
      title: 'Verification Scheduled',
      message: 'Re-verification for application LM-APP-2026-000102 has been scheduled for 2026-09-15 at 02:00 PM with Inspector R. Sharma.',
      type: 'STATUS_CHANGE',
      related_entity_type: 'APPLICATION',
      related_entity_id: 'LM-APP-2026-000102',
      is_read: true,
      created_at: '2026-09-02T16:05:00Z'
    }
  ],

  audit_logs: [
    {
      id: 'al000000-0000-0000-0000-000000000001',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      user_email: 'admin@legalmetrology.demo',
      action: 'STAKEHOLDER_APPROVED',
      entity_type: 'STAKEHOLDER',
      entity_id: 'b0000000-0000-0000-0000-000000000001',
      previous_state: { status: 'PENDING' },
      new_state: { status: 'APPROVED' },
      ip_address: '10.0.4.12',
      created_at: '2026-01-11T12:00:00Z'
    },
    {
      id: 'al000000-0000-0000-0000-000000000002',
      user_id: 'a0000000-0000-0000-0000-000000000001',
      user_email: 'admin@legalmetrology.demo',
      action: 'APPLICATION_ASSIGNED',
      entity_type: 'APPLICATION',
      entity_id: 'LM-APP-2026-000101',
      previous_state: { status: 'SUBMITTED' },
      new_state: { status: 'ASSIGNED', verifier_type: 'LMO', verifier: 'Inspector R. Sharma' },
      ip_address: '10.0.4.12',
      created_at: '2026-02-05T10:00:00Z'
    },
    {
      id: 'al000000-0000-0000-0000-000000000003',
      user_id: 'c0000000-0000-0000-0000-000000000001',
      user_email: 'lmo@legalmetrology.demo',
      action: 'VERIFICATION_SUBMITTED',
      entity_type: 'VERIFICATION_RECORD',
      entity_id: 'f2000000-0000-0000-0000-000000000001',
      previous_state: null,
      new_state: { result: 'PASS', instrument_id: 'e0000000-0000-0000-0000-000000000001' },
      ip_address: '10.0.12.8',
      created_at: '2026-02-10T11:30:00Z'
    },
    {
      id: 'al000000-0000-0000-0000-000000000004',
      user_id: 'c0000000-0000-0000-0000-000000000001',
      user_email: 'lmo@legalmetrology.demo',
      action: 'CERTIFICATE_GENERATED',
      entity_type: 'CERTIFICATE',
      entity_id: 'CERT-2026-000101',
      previous_state: null,
      new_state: { status: 'VALID', valid_until: '2027-02-09' },
      ip_address: '10.0.12.8',
      created_at: '2026-02-10T11:35:00Z'
    }
  ]
};

// HELPER: Auto-calculate certificate validity on read
function enrichCertificateValidity(cert) {
  if (!cert) return null;
  const copy = { ...cert };
  // If not revoked, check against current date
  if (copy.status !== 'REVOKED') {
    const today = new Date();
    const expiry = new Date(copy.valid_until);
    if (today > expiry) {
      copy.status = 'EXPIRED';
    }
  }
  return copy;
}

// Helper: Validate UUID format for Postgres UUID columns
const isUUID = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

// DATABASE ADAPTER EXPORTS
export const db = {
  // ─── Users ─────────────────────────────────────────────────────────────
  async findUserByEmail(email) {
    const normalized = (email || '').trim().toLowerCase();
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', normalized)
          .maybeSingle();
        if (error) console.error('Supabase findUserByEmail error:', error.message);
        if (data) return data;
      } catch (err) {
        console.error('Supabase findUserByEmail exception:', err.message);
      }
    }
    const user = memoryDb.users.find(u => u.email.toLowerCase() === normalized);
    return user ? { ...user } : null;
  },

  async findUserById(id) {
    if (isSupabaseConfigured && isUUID(id)) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (error) console.error('Supabase findUserById error:', error.message);
        if (data) return data;
      } catch (err) {
        console.error('Supabase findUserById exception:', err.message);
      }
    }
    const user = memoryDb.users.find(u => u.id === id);
    return user ? { ...user } : null;
  },

  async createUser(userData) {
    if (isSupabaseConfigured) {
      try {
        const payload = {
          email: (userData.email || '').trim().toLowerCase(),
          password_hash: userData.password_hash,
          role: userData.role || 'OWNER',
          status: userData.status || 'PENDING',
          full_name: userData.full_name,
          phone: userData.phone
        };
        if (userData.id && isUUID(userData.id)) {
          payload.id = userData.id;
        }
        const { data, error } = await supabase
          .from('users')
          .insert([payload])
          .select()
          .single();
        if (error) {
          console.error('Supabase createUser error:', error.message);
          throw error;
        }
        return data;
      } catch (err) {
        console.error('Supabase createUser exception, falling back to memoryDb:', err.message);
      }
    }
    const newUser = {
      id: userData.id || `u-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email.trim().toLowerCase(),
      password_hash: userData.password_hash,
      role: userData.role || 'OWNER',
      status: userData.status || 'PENDING',
      full_name: userData.full_name,
      phone: userData.phone,
      created_at: new Date().toISOString()
    };
    memoryDb.users.push(newUser);
    return { ...newUser };
  },

  async updateUserStatus(userId, status, reviewedBy = null, reviewNotes = null) {
    if (isSupabaseConfigured && isUUID(userId)) {
      try {
        const { data, error } = await supabase
          .from('users')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', userId)
          .select()
          .single();
        if (error) throw error;

        const stakeholderUpdate = {
          review_notes: reviewNotes,
          reviewed_at: new Date().toISOString()
        };
        if (reviewedBy && isUUID(reviewedBy)) {
          stakeholderUpdate.reviewed_by = reviewedBy;
        }
        await supabase
          .from('stakeholders')
          .update(stakeholderUpdate)
          .eq('user_id', userId);

        return data;
      } catch (err) {
        console.error('Supabase updateUserStatus error:', err.message);
      }
    }
    const user = memoryDb.users.find(u => u.id === userId);
    if (user) {
      user.status = status;
      const stakeholder = memoryDb.stakeholders.find(s => s.user_id === userId);
      if (stakeholder) {
        stakeholder.reviewed_by = reviewedBy;
        stakeholder.review_notes = reviewNotes;
        stakeholder.reviewed_at = new Date().toISOString();
      }
      return { ...user };
    }
    return null;
  },

  async getAllUsers(roleFilter = null) {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('users').select('*');
        if (roleFilter) {
          query = query.eq('role', roleFilter);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) {
          console.error('Supabase getAllUsers error:', error.message);
        } else if (data && data.length > 0) {
          const userIds = data.map(u => u.id);
          const [sRes, lRes, gRes] = await Promise.all([
            supabase.from('stakeholders').select('*').in('user_id', userIds),
            supabase.from('lmo_profiles').select('*').in('user_id', userIds),
            supabase.from('gatc_profiles').select('*').in('user_id', userIds)
          ]);
          const stakeholders = sRes.data || [];
          const lmos = lRes.data || [];
          const gatcs = gRes.data || [];

          return data.map(u => ({
            ...u,
            stakeholder: stakeholders.find(s => s.user_id === u.id) || null,
            lmo_profile: lmos.find(l => l.user_id === u.id) || null,
            gatc_profile: gatcs.find(g => g.user_id === u.id) || null
          }));
        }
      } catch (err) {
        console.error('Supabase getAllUsers exception:', err.message);
      }
    }
    let list = memoryDb.users;
    if (roleFilter) {
      list = list.filter(u => u.role === roleFilter);
    }
    return list.map(u => {
      const stakeholder = memoryDb.stakeholders.find(s => s.user_id === u.id);
      const lmoProfile = memoryDb.lmo_profiles.find(l => l.user_id === u.id);
      const gatcProfile = memoryDb.gatc_profiles.find(g => g.user_id === u.id);
      return {
        ...u,
        stakeholder,
        lmo_profile: lmoProfile,
        gatc_profile: gatcProfile
      };
    });
  },

  // ─── Stakeholders ──────────────────────────────────────────────────────
  async getStakeholderByUserId(userId) {
    if (isSupabaseConfigured && isUUID(userId)) {
      try {
        const { data, error } = await supabase
          .from('stakeholders')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        if (error) console.error('Supabase getStakeholderByUserId error:', error.message);
        if (data) return data;
      } catch (err) {
        console.error('Supabase getStakeholderByUserId exception:', err.message);
      }
    }
    const s = memoryDb.stakeholders.find(item => item.user_id === userId);
    return s ? { ...s } : null;
  },

  async createStakeholder(stakeholderData) {
    if (isSupabaseConfigured) {
      try {
        const payload = {
          user_id: stakeholderData.user_id,
          business_name: stakeholderData.business_name,
          business_address: stakeholderData.business_address,
          state: stakeholderData.state || 'Maharashtra',
          district: stakeholderData.district || 'Mumbai',
          pincode: stakeholderData.pincode || '400001',
          trade_license_no: stakeholderData.trade_license_no || null,
          gstin: stakeholderData.gstin || null,
          supporting_documents: stakeholderData.supporting_documents || []
        };
        const { data, error } = await supabase
          .from('stakeholders')
          .insert([payload])
          .select()
          .single();
        if (error) {
          console.error('Supabase createStakeholder error:', error.message);
          throw error;
        }
        return data;
      } catch (err) {
        console.error('Supabase createStakeholder exception:', err.message);
      }
    }
    const newStakeholder = {
      id: `s-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_id: stakeholderData.user_id,
      business_name: stakeholderData.business_name,
      business_address: stakeholderData.business_address,
      state: stakeholderData.state || 'Maharashtra',
      district: stakeholderData.district || 'Mumbai',
      pincode: stakeholderData.pincode || '400001',
      trade_license_no: stakeholderData.trade_license_no || null,
      gstin: stakeholderData.gstin || null,
      supporting_documents: stakeholderData.supporting_documents || [],
      review_notes: null,
      reviewed_by: null,
      reviewed_at: null,
      created_at: new Date().toISOString()
    };
    memoryDb.stakeholders.push(newStakeholder);
    return { ...newStakeholder };
  },

  // ─── Master Data ───────────────────────────────────────────────────────
  async getStates() {
    return [...memoryDb.states];
  },

  async getDistricts(stateName) {
    if (!stateName) return [];
    const districts = memoryDb.districts[stateName];
    return districts ? [...districts] : [];
  },

  // ─── Categories ────────────────────────────────────────────────────────
  async getCategories() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('instrument_categories')
          .select('*')
          .order('name', { ascending: true });
        if (error) console.error('Supabase getCategories error:', error.message);
        if (data && data.length > 0) return data;
      } catch (err) {
        console.error('Supabase getCategories exception:', err.message);
      }
    }
    return [...memoryDb.categories];
  },

  async getCategoryById(id) {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('instrument_categories').select('*');
        if (isUUID(id)) {
          query = query.eq('id', id);
        } else {
          query = query.eq('code', id);
        }
        const { data, error } = await query.maybeSingle();
        if (error) console.error('Supabase getCategoryById error:', error.message);
        if (data) return data;
      } catch (err) {
        console.error('Supabase getCategoryById exception:', err.message);
      }
    }
    const cat = memoryDb.categories.find(c => c.id === id || c.code === id);
    return cat ? { ...cat } : null;
  },

  // ─── Instruments ───────────────────────────────────────────────────────
  async getInstruments(filters = {}) {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('instruments').select(`
          *,
          category:instrument_categories(*)
        `);
        if (filters.owner_id && isUUID(filters.owner_id)) {
          query = query.eq('owner_id', filters.owner_id);
        }
        if (filters.status) {
          query = query.eq('current_status', filters.status);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) {
          console.error('Supabase getInstruments error:', error.message);
        } else if (data) {
          const instIds = data.map(i => i.id);
          let certs = [];
          if (instIds.length > 0) {
            const { data: certData } = await supabase
              .from('certificates')
              .select('*')
              .in('instrument_id', instIds);
            certs = certData || [];
          }
          return data.map(inst => {
            const instCerts = certs
              .filter(c => c.instrument_id === inst.id)
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            return {
              ...inst,
              category: Array.isArray(inst.category) ? inst.category[0] : inst.category,
              certificate: enrichCertificateValidity(instCerts[0] || null)
            };
          });
        }
      } catch (err) {
        console.error('Supabase getInstruments exception:', err.message);
      }
    }
    let items = memoryDb.instruments;
    if (filters.owner_id) items = items.filter(i => i.owner_id === filters.owner_id);
    if (filters.status) items = items.filter(i => i.current_status === filters.status);
    return items.map(inst => {
      const category = memoryDb.categories.find(c => c.id === inst.category_id);
      const cert = memoryDb.certificates
        .filter(c => c.instrument_id === inst.id)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
      return {
        ...inst,
        category,
        certificate: enrichCertificateValidity(cert)
      };
    });
  },

  async getInstrumentById(id) {
    if (isSupabaseConfigured && isUUID(id)) {
      try {
        const { data: inst, error } = await supabase
          .from('instruments')
          .select(`
            *,
            category:instrument_categories(*),
            owner:users(id, full_name, email)
          `)
          .eq('id', id)
          .maybeSingle();
        if (error) {
          console.error('Supabase getInstrumentById error:', error.message);
        } else if (inst) {
          const { data: certs } = await supabase
            .from('certificates')
            .select('*')
            .eq('instrument_id', id)
            .order('created_at', { ascending: false });
          const { data: stakeholder } = await supabase
            .from('stakeholders')
            .select('*')
            .eq('user_id', inst.owner_id)
            .maybeSingle();
          return {
            ...inst,
            category: Array.isArray(inst.category) ? inst.category[0] : inst.category,
            certificate: enrichCertificateValidity(certs?.[0] || null),
            owner: inst.owner ? {
              ...inst.owner,
              business_name: stakeholder?.business_name
            } : null
          };
        }
      } catch (err) {
        console.error('Supabase getInstrumentById exception:', err.message);
      }
    }
    const inst = memoryDb.instruments.find(i => i.id === id);
    if (!inst) return null;
    const category = memoryDb.categories.find(c => c.id === inst.category_id);
    const cert = memoryDb.certificates
      .filter(c => c.instrument_id === inst.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    const owner = memoryDb.users.find(u => u.id === inst.owner_id);
    const stakeholder = memoryDb.stakeholders.find(s => s.user_id === inst.owner_id);
    return {
      ...inst,
      category,
      certificate: enrichCertificateValidity(cert),
      owner: owner ? { ...owner, business_name: stakeholder?.business_name } : null
    };
  },

  async checkSerialUnique(categoryId, serialNumber) {
    if (isSupabaseConfigured && isUUID(categoryId)) {
      try {
        const { data, error } = await supabase
          .from('instruments')
          .select('id')
          .eq('category_id', categoryId)
          .ilike('serial_number', (serialNumber || '').trim());
        if (!error && data) {
          return data.length === 0;
        }
      } catch (err) {
        console.error('Supabase checkSerialUnique exception:', err.message);
      }
    }
    const exists = memoryDb.instruments.some(
      i => i.category_id === categoryId && i.serial_number.toLowerCase() === serialNumber.trim().toLowerCase()
    );
    return !exists;
  },

  async createInstrument(instData) {
    if (isSupabaseConfigured) {
      try {
        const payload = {
          owner_id: instData.owner_id,
          category_id: instData.category_id,
          instrument_type: instData.instrument_type,
          manufacturer: instData.manufacturer,
          model_number: instData.model_number,
          serial_number: (instData.serial_number || '').trim(),
          max_capacity: parseFloat(instData.max_capacity),
          min_capacity: parseFloat(instData.min_capacity),
          unit: instData.unit || 'kg',
          verification_scale_interval: instData.verification_scale_interval ? parseFloat(instData.verification_scale_interval) : null,
          location: instData.location,
          description: instData.description || '',
          photograph_url: instData.photograph_url || null,
          current_status: 'PENDING'
        };
        const { data, error } = await supabase
          .from('instruments')
          .insert([payload])
          .select()
          .single();
        if (error) {
          console.error('Supabase createInstrument error:', error.message);
          throw error;
        }
        return this.getInstrumentById(data.id);
      } catch (err) {
        console.error('Supabase createInstrument exception:', err.message);
      }
    }
    const newInst = {
      id: `inst-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      owner_id: instData.owner_id,
      category_id: instData.category_id,
      instrument_type: instData.instrument_type,
      manufacturer: instData.manufacturer,
      model_number: instData.model_number,
      serial_number: instData.serial_number.trim(),
      max_capacity: parseFloat(instData.max_capacity),
      min_capacity: parseFloat(instData.min_capacity),
      unit: instData.unit || 'kg',
      verification_scale_interval: instData.verification_scale_interval ? parseFloat(instData.verification_scale_interval) : null,
      location: instData.location,
      description: instData.description || '',
      photograph_url: instData.photograph_url || null,
      current_status: 'PENDING',
      created_at: new Date().toISOString()
    };
    memoryDb.instruments.push(newInst);
    return this.getInstrumentById(newInst.id);
  },

  async updateInstrumentStatus(id, status) {
    if (isSupabaseConfigured && isUUID(id)) {
      try {
        const { data, error } = await supabase
          .from('instruments')
          .update({ current_status: status, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase updateInstrumentStatus exception:', err.message);
      }
    }
    const inst = memoryDb.instruments.find(i => i.id === id);
    if (inst) {
      inst.current_status = status;
      return { ...inst };
    }
    return null;
  },

  // ─── Applications ──────────────────────────────────────────────────────
  async getApplications(filters = {}) {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('applications').select(`
          *,
          instrument:instruments(
            *,
            category:instrument_categories(*)
          ),
          owner:users(id, full_name, email, phone),
          assignments(*),
          schedules(*)
        `);
        if (filters.owner_id && isUUID(filters.owner_id)) {
          query = query.eq('owner_id', filters.owner_id);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) {
          console.error('Supabase getApplications error:', error.message);
        } else if (data) {
          const ownerIds = [...new Set(data.map(a => a.owner_id).filter(Boolean))];
          let stakeholders = [];
          if (ownerIds.length > 0) {
            const { data: sData } = await supabase.from('stakeholders').select('*').in('user_id', ownerIds);
            stakeholders = sData || [];
          }

          const allAssignments = data.flatMap(a => a.assignments || []);
          const verifierIds = [...new Set(allAssignments.filter(as => as.is_active).map(as => as.verifier_id).filter(Boolean))];
          let verifierUsers = [];
          if (verifierIds.length > 0) {
            const { data: vData } = await supabase.from('users').select('id, full_name, email').in('id', verifierIds);
            verifierUsers = vData || [];
          }

          let results = data.map(app => {
            const activeAssignment = Array.isArray(app.assignments)
              ? app.assignments.find(as => as.is_active)
              : (app.assignments?.is_active ? app.assignments : null);

            let verifierDetails = null;
            if (activeAssignment) {
              const vUser = verifierUsers.find(u => u.id === activeAssignment.verifier_id);
              verifierDetails = {
                type: activeAssignment.verifier_type,
                id: activeAssignment.verifier_id,
                name: vUser?.full_name || 'Assigned Verifier',
                email: vUser?.email
              };
            }

            const stakeholder = stakeholders.find(s => s.user_id === app.owner_id);
            const schedule = Array.isArray(app.schedules) ? app.schedules[0] : app.schedules;
            const inst = app.instrument;
            const category = inst ? (Array.isArray(inst.category) ? inst.category[0] : inst.category) : null;

            return {
              ...app,
              instrument: inst ? { ...inst, category } : null,
              owner: app.owner ? { ...app.owner, business_name: stakeholder?.business_name } : null,
              assignment: activeAssignment,
              verifier: verifierDetails,
              schedule
            };
          });

          if (filters.verifier_id) {
            results = results.filter(a => a.assignment && a.assignment.verifier_id === filters.verifier_id);
          }
          return results;
        }
      } catch (err) {
        console.error('Supabase getApplications exception:', err.message);
      }
    }
    let items = memoryDb.applications;
    if (filters.owner_id) {
      items = items.filter(a => a.owner_id === filters.owner_id);
    }
    if (filters.status) {
      items = items.filter(a => a.status === filters.status);
    }
    if (filters.verifier_id) {
      const assignedAppIds = memoryDb.assignments
        .filter(as => as.verifier_id === filters.verifier_id && as.is_active)
        .map(as => as.application_id);
      items = items.filter(a => assignedAppIds.includes(a.id));
    }

    return items.map(app => {
      const instrument = memoryDb.instruments.find(i => i.id === app.instrument_id);
      const category = instrument ? memoryDb.categories.find(c => c.id === instrument.category_id) : null;
      const owner = memoryDb.users.find(u => u.id === app.owner_id);
      const stakeholder = memoryDb.stakeholders.find(s => s.user_id === app.owner_id);
      const assignment = memoryDb.assignments.find(as => as.application_id === app.id && as.is_active);
      const schedule = memoryDb.schedules.find(sc => sc.application_id === app.id);
      let verifierDetails = null;
      if (assignment) {
        const vUser = memoryDb.users.find(u => u.id === assignment.verifier_id);
        verifierDetails = {
          type: assignment.verifier_type,
          id: assignment.verifier_id,
          name: vUser?.full_name || 'Assigned Verifier',
          email: vUser?.email
        };
      }

      return {
        ...app,
        instrument: instrument ? { ...instrument, category } : null,
        owner: owner ? { ...owner, business_name: stakeholder?.business_name } : null,
        assignment,
        verifier: verifierDetails,
        schedule
      };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getApplicationById(id) {
    if (isSupabaseConfigured) {
      try {
        const { data: app, error } = await supabase
          .from('applications')
          .select(`
            *,
            instrument:instruments(
              *,
              category:instrument_categories(*)
            ),
            owner:users(id, full_name, email, phone),
            assignments(*),
            schedules(*),
            verification_records(*)
          `)
          .eq('id', id)
          .maybeSingle();
        if (app) {
          const activeAssignment = Array.isArray(app.assignments)
            ? app.assignments.find(as => as.is_active)
            : (app.assignments?.is_active ? app.assignments : null);

          let verifier = null;
          if (activeAssignment) {
            const { data: vUser } = await supabase
              .from('users')
              .select('id, full_name, email, role')
              .eq('id', activeAssignment.verifier_id)
              .maybeSingle();
            verifier = {
              type: activeAssignment.verifier_type,
              id: activeAssignment.verifier_id,
              name: vUser?.full_name,
              email: vUser?.email
            };
          }

          const { data: stakeholder } = await supabase
            .from('stakeholders')
            .select('*')
            .eq('user_id', app.owner_id)
            .maybeSingle();

          const { data: cert } = await supabase
            .from('certificates')
            .select('*')
            .eq('instrument_id', app.instrument_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          const schedule = Array.isArray(app.schedules) ? app.schedules[0] : app.schedules;
          const verificationRecord = Array.isArray(app.verification_records) ? app.verification_records[0] : app.verification_records;
          const inst = app.instrument;
          const category = inst ? (Array.isArray(inst.category) ? inst.category[0] : inst.category) : null;

          return {
            ...app,
            instrument: inst ? { ...inst, category } : null,
            owner: app.owner ? { ...app.owner, business_name: stakeholder?.business_name, stakeholder } : null,
            assignment: activeAssignment,
            verifier,
            schedule,
            verification_record: verificationRecord,
            certificate: enrichCertificateValidity(cert)
          };
        }
      } catch (err) {
        console.error('Supabase getApplicationById exception:', err.message);
      }
    }
    const app = memoryDb.applications.find(a => a.id === id);
    if (!app) return null;
    const instrument = memoryDb.instruments.find(i => i.id === app.instrument_id);
    const category = instrument ? memoryDb.categories.find(c => c.id === instrument.category_id) : null;
    const owner = memoryDb.users.find(u => u.id === app.owner_id);
    const stakeholder = memoryDb.stakeholders.find(s => s.user_id === app.owner_id);
    const assignment = memoryDb.assignments.find(as => as.application_id === app.id && as.is_active);
    const schedule = memoryDb.schedules.find(sc => sc.application_id === app.id);
    const verificationRecord = memoryDb.verification_records.find(vr => vr.application_id === app.id);
    const certificate = memoryDb.certificates.find(c => c.instrument_id === app.instrument_id);

    let verifier = null;
    if (assignment) {
      const vUser = memoryDb.users.find(u => u.id === assignment.verifier_id);
      verifier = {
        type: assignment.verifier_type,
        id: assignment.verifier_id,
        name: vUser?.full_name,
        email: vUser?.email
      };
    }

    return {
      ...app,
      instrument: instrument ? { ...instrument, category } : null,
      owner: owner ? { ...owner, business_name: stakeholder?.business_name, stakeholder } : null,
      assignment,
      verifier,
      schedule,
      verification_record: verificationRecord,
      certificate: enrichCertificateValidity(certificate)
    };
  },

  async createApplication(appData) {
    if (isSupabaseConfigured) {
      try {
        const year = new Date().getFullYear();
        const { count } = await supabase.from('applications').select('*', { count: 'exact', head: true });
        const appId = `LM-APP-${year}-${String((count || 0) + 101).padStart(6, '0')}`;

        const payload = {
          id: appId,
          owner_id: appData.owner_id,
          instrument_id: appData.instrument_id,
          application_type: appData.application_type || 'NEW',
          preferred_date: appData.preferred_date,
          preferred_time: appData.preferred_time || '10:00 AM',
          remarks: appData.remarks || '',
          status: 'SUBMITTED',
          documents: appData.documents || []
        };

        const { data, error } = await supabase
          .from('applications')
          .insert([payload])
          .select()
          .single();
        if (error) {
          console.error('Supabase createApplication error:', error.message);
          throw error;
        }

        await this.updateInstrumentStatus(appData.instrument_id, 'PENDING');
        return this.getApplicationById(data.id);
      } catch (err) {
        console.error('Supabase createApplication exception:', err.message);
      }
    }
    const year = new Date().getFullYear();
    const count = memoryDb.applications.length + 101;
    const appId = `LM-APP-${year}-${String(count).padStart(6, '0')}`;

    const newApp = {
      id: appId,
      owner_id: appData.owner_id,
      instrument_id: appData.instrument_id,
      application_type: appData.application_type || 'NEW',
      preferred_date: appData.preferred_date,
      preferred_time: appData.preferred_time || '10:00 AM',
      remarks: appData.remarks || '',
      status: 'SUBMITTED',
      documents: appData.documents || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    memoryDb.applications.push(newApp);
    await this.updateInstrumentStatus(appData.instrument_id, 'PENDING');
    return this.getApplicationById(newApp.id);
  },

  async updateApplicationStatus(appId, status) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', appId)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase updateApplicationStatus exception:', err.message);
      }
    }
    const app = memoryDb.applications.find(a => a.id === appId);
    if (app) {
      app.status = status;
      app.updated_at = new Date().toISOString();
      return { ...app };
    }
    return null;
  },

  // ─── Allocation & Scheduling ───────────────────────────────────────────
  async assignApplication(appId, verifierType, verifierId, assignedBy, notes = '') {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('assignments')
          .update({ is_active: false })
          .eq('application_id', appId);

        const payload = {
          application_id: appId,
          verifier_type: verifierType,
          verifier_id: verifierId,
          assigned_by: assignedBy,
          notes,
          is_active: true
        };
        const { data, error } = await supabase
          .from('assignments')
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        await this.updateApplicationStatus(appId, 'ASSIGNED');
        return data;
      } catch (err) {
        console.error('Supabase assignApplication exception:', err.message);
      }
    }
    memoryDb.assignments.forEach(as => {
      if (as.application_id === appId) as.is_active = false;
    });

    const newAssignment = {
      id: `as-${Date.now()}`,
      application_id: appId,
      verifier_type: verifierType,
      verifier_id: verifierId,
      assigned_by: assignedBy,
      assigned_date: new Date().toISOString(),
      notes,
      is_active: true
    };
    memoryDb.assignments.push(newAssignment);
    await this.updateApplicationStatus(appId, 'ASSIGNED');
    return newAssignment;
  },

  async scheduleVerification(appId, date, time, location, verifierId, notes = '') {
    if (isSupabaseConfigured) {
      try {
        const { data: existing } = await supabase
          .from('schedules')
          .select('id')
          .eq('application_id', appId)
          .maybeSingle();

        let res;
        if (existing) {
          const { data, error } = await supabase
            .from('schedules')
            .update({
              scheduled_date: date,
              scheduled_time: time,
              location,
              verifier_id: verifierId,
              status: 'SCHEDULED',
              reschedule_reason: notes,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
            .select()
            .single();
          if (error) throw error;
          res = data;
        } else {
          const { data, error } = await supabase
            .from('schedules')
            .insert([{
              application_id: appId,
              scheduled_date: date,
              scheduled_time: time,
              location,
              verifier_id: verifierId,
              status: 'SCHEDULED'
            }])
            .select()
            .single();
          if (error) throw error;
          res = data;
        }
        await this.updateApplicationStatus(appId, 'SCHEDULED');
        return res;
      } catch (err) {
        console.error('Supabase scheduleVerification exception:', err.message);
      }
    }
    let schedule = memoryDb.schedules.find(s => s.application_id === appId);
    if (schedule) {
      schedule.scheduled_date = date;
      schedule.scheduled_time = time;
      schedule.location = location;
      schedule.verifier_id = verifierId;
      schedule.status = 'SCHEDULED';
      schedule.reschedule_reason = notes;
      schedule.updated_at = new Date().toISOString();
    } else {
      schedule = {
        id: `sc-${Date.now()}`,
        application_id: appId,
        scheduled_date: date,
        scheduled_time: time,
        location,
        verifier_id: verifierId,
        status: 'SCHEDULED',
        created_at: new Date().toISOString()
      };
      memoryDb.schedules.push(schedule);
    }

    await this.updateApplicationStatus(appId, 'SCHEDULED');
    return schedule;
  },

  // ─── Verification ──────────────────────────────────────────────────────
  async createVerificationRecord(recordData) {
    if (isSupabaseConfigured) {
      try {
        const payload = {
          application_id: recordData.application_id,
          instrument_id: recordData.instrument_id,
          verifier_id: recordData.verifier_id,
          verifier_role: recordData.verifier_role,
          inspection_date: new Date().toISOString(),
          visual_checklist: recordData.visual_checklist || {},
          metrological_tests: recordData.metrological_tests || {},
          observations: recordData.observations || '',
          test_results: recordData.test_results || '',
          evidence_photos: recordData.evidence_photos || [],
          remarks: recordData.remarks || '',
          result: recordData.result
        };
        const { data, error } = await supabase
          .from('verification_records')
          .insert([payload])
          .select()
          .single();
        if (error) throw error;

        if (recordData.result === 'PASS') {
          await this.updateApplicationStatus(recordData.application_id, 'COMPLETED');
          await this.updateInstrumentStatus(recordData.instrument_id, 'VALID');
        } else {
          await this.updateApplicationStatus(recordData.application_id, 'FAILED');
          await this.updateInstrumentStatus(recordData.instrument_id, 'FAILED');
        }
        return data;
      } catch (err) {
        console.error('Supabase createVerificationRecord exception:', err.message);
      }
    }
    const newRecord = {
      id: `vr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      application_id: recordData.application_id,
      instrument_id: recordData.instrument_id,
      verifier_id: recordData.verifier_id,
      verifier_role: recordData.verifier_role,
      inspection_date: new Date().toISOString(),
      visual_checklist: recordData.visual_checklist || {},
      metrological_tests: recordData.metrological_tests || {},
      observations: recordData.observations || '',
      test_results: recordData.test_results || '',
      evidence_photos: recordData.evidence_photos || [],
      remarks: recordData.remarks || '',
      result: recordData.result,
      created_at: new Date().toISOString()
    };
    memoryDb.verification_records.push(newRecord);

    if (recordData.result === 'PASS') {
      await this.updateApplicationStatus(recordData.application_id, 'COMPLETED');
      await this.updateInstrumentStatus(recordData.instrument_id, 'VALID');
    } else {
      await this.updateApplicationStatus(recordData.application_id, 'FAILED');
      await this.updateInstrumentStatus(recordData.instrument_id, 'FAILED');
    }

    return newRecord;
  },

  // ─── Certificates ──────────────────────────────────────────────────────
  async createCertificate(certData) {
    if (isSupabaseConfigured) {
      try {
        const year = new Date().getFullYear();
        const { count } = await supabase.from('certificates').select('*', { count: 'exact', head: true });
        const certId = `CERT-${year}-${String((count || 0) + 101).padStart(6, '0')}`;

        const payload = {
          id: certId,
          verification_record_id: certData.verification_record_id,
          instrument_id: certData.instrument_id,
          owner_id: certData.owner_id,
          verifier_id: certData.verifier_id,
          verifying_authority: certData.verifying_authority || 'Department of Legal Metrology, Government of India',
          verifier_name: certData.verifier_name,
          verification_date: certData.verification_date || new Date().toISOString().split('T')[0],
          valid_until: certData.valid_until,
          status: 'VALID',
          qr_verification_url: `/verify/${certId}`,
          digital_signature_hash: certData.digital_signature_hash || `SHA256:${Math.random().toString(36).substring(2)}${Date.now()}`
        };

        const { data, error } = await supabase
          .from('certificates')
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        return this.getCertificateById(data.id);
      } catch (err) {
        console.error('Supabase createCertificate exception:', err.message);
      }
    }
    const year = new Date().getFullYear();
    const count = memoryDb.certificates.length + 101;
    const certId = `CERT-${year}-${String(count).padStart(6, '0')}`;

    const newCert = {
      id: certId,
      verification_record_id: certData.verification_record_id,
      instrument_id: certData.instrument_id,
      owner_id: certData.owner_id,
      verifier_id: certData.verifier_id,
      verifying_authority: certData.verifying_authority || 'Department of Legal Metrology, Government of India',
      verifier_name: certData.verifier_name,
      verification_date: certData.verification_date || new Date().toISOString().split('T')[0],
      valid_until: certData.valid_until,
      status: 'VALID',
      qr_verification_url: `/verify/${certId}`,
      digital_signature_hash: certData.digital_signature_hash || `SHA256:${Math.random().toString(36).substring(2)}${Date.now()}`,
      pdf_url: null,
      revocation_reason: null,
      revoked_at: null,
      revoked_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    memoryDb.certificates.push(newCert);
    return this.getCertificateById(newCert.id);
  },

  async getCertificates(filters = {}) {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('certificates').select(`
          *,
          instrument:instruments(*)
        `);
        if (filters.owner_id && isUUID(filters.owner_id)) {
          query = query.eq('owner_id', filters.owner_id);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        const { data, error } = await query.order('verification_date', { ascending: false });
        if (error) {
          console.error('Supabase getCertificates error:', error.message);
        } else if (data) {
          const ownerIds = [...new Set(data.map(c => c.owner_id).filter(Boolean))];
          let stakeholders = [];
          let owners = [];
          if (ownerIds.length > 0) {
            const [sRes, uRes] = await Promise.all([
              supabase.from('stakeholders').select('*').in('user_id', ownerIds),
              supabase.from('users').select('id, full_name, email').in('id', ownerIds)
            ]);
            stakeholders = sRes.data || [];
            owners = uRes.data || [];
          }
          return data.map(c => {
            const enriched = enrichCertificateValidity(c);
            const stakeholder = stakeholders.find(s => s.user_id === c.owner_id);
            const owner = owners.find(u => u.id === c.owner_id);
            return {
              ...enriched,
              instrument: c.instrument,
              owner: owner ? { ...owner, business_name: stakeholder?.business_name } : null
            };
          });
        }
      } catch (err) {
        console.error('Supabase getCertificates exception:', err.message);
      }
    }
    let items = memoryDb.certificates;
    if (filters.owner_id) {
      items = items.filter(c => c.owner_id === filters.owner_id);
    }
    if (filters.status) {
      items = items.filter(c => c.status === filters.status);
    }

    return items.map(c => {
      const enriched = enrichCertificateValidity(c);
      const instrument = memoryDb.instruments.find(i => i.id === c.instrument_id);
      const owner = memoryDb.users.find(u => u.id === c.owner_id);
      const stakeholder = memoryDb.stakeholders.find(s => s.user_id === c.owner_id);
      return {
        ...enriched,
        instrument,
        owner: owner ? { ...owner, business_name: stakeholder?.business_name } : null
      };
    }).sort((a, b) => new Date(b.verification_date) - new Date(a.verification_date));
  },

  async getCertificateById(id) {
    if (isSupabaseConfigured) {
      try {
        const { data: cert, error } = await supabase
          .from('certificates')
          .select(`
            *,
            instrument:instruments(
              *,
              category:instrument_categories(*)
            ),
            verification_record:verification_records(*)
          `)
          .eq('id', id)
          .maybeSingle();
        if (cert) {
          const enriched = enrichCertificateValidity(cert);
          const [ownerRes, verifierRes, stakeholderRes] = await Promise.all([
            supabase.from('users').select('id, full_name, email').eq('id', cert.owner_id).maybeSingle(),
            cert.verifier_id ? supabase.from('users').select('id, full_name, email, role').eq('id', cert.verifier_id).maybeSingle() : Promise.resolve({ data: null }),
            supabase.from('stakeholders').select('*').eq('user_id', cert.owner_id).maybeSingle()
          ]);

          const owner = ownerRes.data;
          const verifier = verifierRes.data;
          const stakeholder = stakeholderRes.data;
          const inst = cert.instrument;
          const category = inst ? (Array.isArray(inst.category) ? inst.category[0] : inst.category) : null;
          const vr = Array.isArray(cert.verification_record) ? cert.verification_record[0] : cert.verification_record;

          return {
            ...enriched,
            instrument: inst ? { ...inst, category } : null,
            owner: owner ? { ...owner, business_name: stakeholder?.business_name, stakeholder } : null,
            verifier: verifier ? { id: verifier.id, name: verifier.full_name, email: verifier.email, role: verifier.role } : null,
            verification_record: vr
          };
        }
      } catch (err) {
        console.error('Supabase getCertificateById exception:', err.message);
      }
    }
    const cert = memoryDb.certificates.find(c => c.id === id);
    if (!cert) return null;
    const enriched = enrichCertificateValidity(cert);
    const instrument = memoryDb.instruments.find(i => i.id === cert.instrument_id);
    const category = instrument ? memoryDb.categories.find(cat => cat.id === instrument.category_id) : null;
    const owner = memoryDb.users.find(u => u.id === cert.owner_id);
    const stakeholder = memoryDb.stakeholders.find(s => s.user_id === cert.owner_id);
    const verifier = memoryDb.users.find(u => u.id === cert.verifier_id);
    const verificationRecord = memoryDb.verification_records.find(vr => vr.id === cert.verification_record_id);

    return {
      ...enriched,
      instrument: instrument ? { ...instrument, category } : null,
      owner: owner ? { ...owner, business_name: stakeholder?.business_name, stakeholder } : null,
      verifier: verifier ? { id: verifier.id, name: verifier.full_name, email: verifier.email, role: verifier.role } : null,
      verification_record: verificationRecord
    };
  },

  async revokeCertificate(id, reason, revokedBy) {
    if (isSupabaseConfigured) {
      try {
        const updatePayload = {
          status: 'REVOKED',
          revocation_reason: reason,
          revoked_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        if (revokedBy && isUUID(revokedBy)) {
          updatePayload.revoked_by = revokedBy;
        }
        const { data: cert, error } = await supabase
          .from('certificates')
          .update(updatePayload)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        await this.updateInstrumentStatus(cert.instrument_id, 'FAILED');
        return this.getCertificateById(id);
      } catch (err) {
        console.error('Supabase revokeCertificate exception:', err.message);
      }
    }
    const cert = memoryDb.certificates.find(c => c.id === id);
    if (!cert) return null;
    cert.status = 'REVOKED';
    cert.revocation_reason = reason;
    cert.revoked_at = new Date().toISOString();
    cert.revoked_by = revokedBy;
    cert.updated_at = new Date().toISOString();

    await this.updateInstrumentStatus(cert.instrument_id, 'FAILED');
    return this.getCertificateById(id);
  },

  // ─── Notifications ─────────────────────────────────────────────────────
  async getNotifications(userId) {
    if (isSupabaseConfigured && isUUID(userId)) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase getNotifications exception:', err.message);
      }
    }
    return memoryDb.notifications
      .filter(n => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async createNotification(notifData) {
    if (isSupabaseConfigured && isUUID(notifData.user_id)) {
      try {
        const payload = {
          user_id: notifData.user_id,
          title: notifData.title,
          message: notifData.message,
          type: notifData.type || 'INFO',
          related_entity_type: notifData.related_entity_type || null,
          related_entity_id: notifData.related_entity_id ? String(notifData.related_entity_id) : null,
          is_read: false
        };
        const { data, error } = await supabase
          .from('notifications')
          .insert([payload])
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase createNotification exception:', err.message);
      }
    }
    const newNotif = {
      id: `n-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      user_id: notifData.user_id,
      title: notifData.title,
      message: notifData.message,
      type: notifData.type || 'INFO',
      related_entity_type: notifData.related_entity_type || null,
      related_entity_id: notifData.related_entity_id || null,
      is_read: false,
      created_at: new Date().toISOString()
    };
    memoryDb.notifications.push(newNotif);
    return newNotif;
  },

  async markNotificationRead(id) {
    if (isSupabaseConfigured && isUUID(id)) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase markNotificationRead exception:', err.message);
      }
    }
    const notif = memoryDb.notifications.find(n => n.id === id);
    if (notif) {
      notif.is_read = true;
      return notif;
    }
    return null;
  },

  // ─── Audit Logs ────────────────────────────────────────────────────────
  async createAuditLog(logData) {
    if (isSupabaseConfigured) {
      try {
        const payload = {
          user_id: (logData.user_id && isUUID(logData.user_id)) ? logData.user_id : null,
          user_email: logData.user_email || 'system',
          action: logData.action,
          entity_type: logData.entity_type,
          entity_id: String(logData.entity_id),
          previous_state: logData.previous_state || null,
          new_state: logData.new_state || null,
          ip_address: logData.ip_address || '127.0.0.1'
        };
        const { data, error } = await supabase
          .from('audit_logs')
          .insert([payload])
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase createAuditLog exception:', err.message);
      }
    }
    const newLog = {
      id: `al-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      user_id: logData.user_id || null,
      user_email: logData.user_email || 'system',
      action: logData.action,
      entity_type: logData.entity_type,
      entity_id: String(logData.entity_id),
      previous_state: logData.previous_state || null,
      new_state: logData.new_state || null,
      ip_address: logData.ip_address || '127.0.0.1',
      created_at: new Date().toISOString()
    };
    memoryDb.audit_logs.push(newLog);
    return newLog;
  },

  async getAuditLogs(filters = {}) {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
        if (filters.action) query = query.ilike('action', `%${filters.action}%`);
        if (filters.entity_type) query = query.eq('entity_type', filters.entity_type);
        const { data, error } = await query;
        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase getAuditLogs exception:', err.message);
      }
    }
    let logs = memoryDb.audit_logs;
    if (filters.action) {
      logs = logs.filter(l => l.action.includes(filters.action));
    }
    if (filters.entity_type) {
      logs = logs.filter(l => l.entity_type === filters.entity_type);
    }
    return logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  // ─── Profiles ──────────────────────────────────────────────────────────
  async getLmoProfiles() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('lmo_profiles')
          .select('*, user:users(id, full_name, email)');
        if (!error && data && data.length > 0) {
          return data.map(lp => ({
            ...lp,
            user: Array.isArray(lp.user) ? lp.user[0] : lp.user
          }));
        }
      } catch (err) {
        console.error('Supabase getLmoProfiles exception:', err.message);
      }
    }
    return memoryDb.lmo_profiles.map(lp => {
      const user = memoryDb.users.find(u => u.id === lp.user_id);
      return { ...lp, user: user ? { id: user.id, full_name: user.full_name, email: user.email } : null };
    });
  },

  async getGatcProfiles() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('gatc_profiles')
          .select('*, user:users(id, full_name, email)');
        if (!error && data && data.length > 0) {
          return data.map(gp => ({
            ...gp,
            user: Array.isArray(gp.user) ? gp.user[0] : gp.user
          }));
        }
      } catch (err) {
        console.error('Supabase getGatcProfiles exception:', err.message);
      }
    }
    return memoryDb.gatc_profiles.map(gp => {
      const user = memoryDb.users.find(u => u.id === gp.user_id);
      return { ...gp, user: user ? { id: user.id, full_name: user.full_name, email: user.email } : null };
    });
  },

  // ─── Aggregated Stats for Dashboards ───────────────────────────────────
  async getAdminStats() {
    if (isSupabaseConfigured) {
      try {
        const [appsRes, certsRes, ownersRes, instRes] = await Promise.all([
          supabase.from('applications').select('status'),
          supabase.from('certificates').select('status, valid_until'),
          supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'OWNER').eq('status', 'PENDING'),
          supabase.from('instruments').select('id', { count: 'exact', head: true })
        ]);

        const apps = appsRes.data || [];
        const certs = (certsRes.data || []).map(enrichCertificateValidity);

        return {
          totalApplications: apps.length,
          newApplications: apps.filter(a => a.status === 'SUBMITTED').length,
          pendingAllocation: apps.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length,
          scheduled: apps.filter(a => a.status === 'SCHEDULED').length,
          underVerification: apps.filter(a => a.status === 'ASSIGNED' || a.status === 'UNDER_VERIFICATION').length,
          completed: apps.filter(a => a.status === 'COMPLETED').length,
          failed: apps.filter(a => a.status === 'FAILED').length,
          validCertificates: certs.filter(c => c.status === 'VALID').length,
          expiredCertificates: certs.filter(c => c.status === 'EXPIRED').length,
          revokedCertificates: certs.filter(c => c.status === 'REVOKED').length,
          pendingStakeholders: ownersRes.count || 0,
          totalInstruments: instRes.count || 0
        };
      } catch (err) {
        console.error('Supabase getAdminStats exception:', err.message);
      }
    }
    const totalApps = memoryDb.applications.length;
    const newApps = memoryDb.applications.filter(a => a.status === 'SUBMITTED').length;
    const pendingAlloc = memoryDb.applications.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length;
    const scheduled = memoryDb.applications.filter(a => a.status === 'SCHEDULED').length;
    const underVerification = memoryDb.applications.filter(a => a.status === 'ASSIGNED' || a.status === 'UNDER_VERIFICATION').length;
    const completed = memoryDb.applications.filter(a => a.status === 'COMPLETED').length;
    const failed = memoryDb.applications.filter(a => a.status === 'FAILED').length;
    
    const certs = memoryDb.certificates.map(enrichCertificateValidity);
    const validCerts = certs.filter(c => c.status === 'VALID').length;
    const expiredCerts = certs.filter(c => c.status === 'EXPIRED').length;
    const revokedCerts = certs.filter(c => c.status === 'REVOKED').length;

    const pendingStakeholders = memoryDb.users.filter(u => u.role === 'OWNER' && u.status === 'PENDING').length;

    return {
      totalApplications: totalApps,
      newApplications: newApps,
      pendingAllocation: pendingAlloc,
      scheduled,
      underVerification,
      completed,
      failed,
      validCertificates: validCerts,
      expiredCertificates: expiredCerts,
      revokedCertificates: revokedCerts,
      pendingStakeholders,
      totalInstruments: memoryDb.instruments.length
    };
  },

  async getOwnerStats(ownerId) {
    if (isSupabaseConfigured && isUUID(ownerId)) {
      try {
        const [instRes, appsRes, certsRes] = await Promise.all([
          supabase.from('instruments').select('id').eq('owner_id', ownerId),
          supabase.from('applications').select('status').eq('owner_id', ownerId),
          supabase.from('certificates').select('status, valid_until').eq('owner_id', ownerId)
        ]);

        const instruments = instRes.data || [];
        const applications = appsRes.data || [];
        const certs = (certsRes.data || []).map(enrichCertificateValidity);

        const validCerts = certs.filter(c => c.status === 'VALID').length;
        const expiredCerts = certs.filter(c => c.status === 'EXPIRED').length;

        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);
        const expiringSoon = certs.filter(c => {
          if (c.status !== 'VALID') return false;
          const expiry = new Date(c.valid_until);
          return expiry >= now && expiry <= thirtyDaysFromNow;
        }).length;

        const pendingApps = applications.filter(a => ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'SCHEDULED', 'UNDER_VERIFICATION'].includes(a.status)).length;

        return {
          totalInstruments: instruments.length,
          pendingApplications: pendingApps,
          validCertificates: validCerts,
          expiringSoon,
          expiredCertificates: expiredCerts
        };
      } catch (err) {
        console.error('Supabase getOwnerStats exception:', err.message);
      }
    }
    const instruments = memoryDb.instruments.filter(i => i.owner_id === ownerId);
    const applications = memoryDb.applications.filter(a => a.owner_id === ownerId);
    const certs = memoryDb.certificates.filter(c => c.owner_id === ownerId).map(enrichCertificateValidity);

    const validCerts = certs.filter(c => c.status === 'VALID').length;
    const expiredCerts = certs.filter(c => c.status === 'EXPIRED').length;
    
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    const expiringSoon = certs.filter(c => {
      if (c.status !== 'VALID') return false;
      const expiry = new Date(c.valid_until);
      return expiry >= now && expiry <= thirtyDaysFromNow;
    }).length;

    const pendingApps = applications.filter(a => ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'SCHEDULED', 'UNDER_VERIFICATION'].includes(a.status)).length;

    return {
      totalInstruments: instruments.length,
      pendingApplications: pendingApps,
      validCertificates: validCerts,
      expiringSoon,
      expiredCertificates: expiredCerts
    };
  }
};
