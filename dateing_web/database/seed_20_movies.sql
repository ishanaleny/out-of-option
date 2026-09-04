-- 1. Remove foreign key constraint to auth.users so mock seed data can be inserted without real auth users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Clear existing profiles
DELETE FROM public.profiles;

-- 3. Insert 20 Indian / Malayalam Movie Character Seed Profiles
INSERT INTO public.profiles (
  id,
  email,
  username,
  name,
  age,
  gender,
  location,
  profile_photo,
  bio,
  interests,
  personality,
  hobby,
  favorite_food,
  favorite_number,
  favorite_color,
  favorite_animal,
  music_type,
  movie_type,
  uselessness_score,
  alarms_per_morning,
  unread_messages,
  average_reply_time,
  most_useless_skill,
  weirdest_fear,
  red_flag,
  green_flag,
  most_used_phrase,
  last_google_search,
  would_survive_zombie_apocalypse,
  reason_they_are_single,
  created_at,
  updated_at
) VALUES
(
  'a0000000-0000-4000-a000-000000000001', 'baahubali@maheshmati.com', 'baahubali', 'Amarendra Baahubali', 28, 'Male', 'Mahishmati', 'https://upload.wikimedia.org/wikipedia/en/7/75/Baahubali_the_Beginning_poster.jpg', 'Can lift a 5-ton Shivling single-handedly but will blindly obey whatever my mom says.', 'Archery, Kingdom Building, Sword Fighting, Devotion', 'Heroic, Royal, Slightly Naive', 'Carving waterfall sculptures', 'Royal Feast', 1, 'Gold', 'Elephant', 'Epic Orchestral', 'Action', 2, 1, 99, '5 minutes', 'Carving rocks with bare hands', 'Mother getting upset', 'Listens to mom over wife', 'Will die for honor', 'Jai Mahishmati!', 'How to convince mother about secret marriage', TRUE, 'Family drama escalated into a civil war', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
),
(
  'a0000000-0000-4000-a000-000000000002', 'kabir@medical.com', 'kabirsingh', 'Kabir Singh', 29, 'Male', 'Delhi', 'https://upload.wikimedia.org/wikipedia/en/d/dc/Kabir_Singh_poster.jpg', 'Surgeon by day, professional rage-monster by night. Looking for someone who doesn''t mind intense eye contact.', 'Medicine, Football, Heavy Drinking, Anger Management', 'Intense, Toxic, Protective', 'Riding Royal Enfield at 120kmh', 'Black Coffee', 0, 'Black', 'Bulldog', 'Sad Acoustic', 'Drama', 4, 10, 543, '3 days', 'Performing surgery hungover', 'Therapy', 'Severe anger issues', 'Top rank in MBBS', 'Who touched her?!', 'Is ice water good for anger control', TRUE, 'Scared away everyone within 5km', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
),
(
  'a0000000-0000-4000-a000-000000000003', 'jaison@kurukkanmoola.com', 'minnalmurali', 'Minnal Murali (Jaison)', 26, 'Male', 'Kurukkanmoola', 'https://upload.wikimedia.org/wikipedia/en/a/a2/Minnal_Murali_poster.jpg', 'Got struck by lightning and now I have superpowers. Still tailoring suits for local weddings.', 'Tailoring, American Pop Culture, Superheroics, Running Fast', 'Quirky, Soft-hearted, Heroic', 'Designing custom suits', 'Sadhya', 7, 'Red', 'Lightning Bug', '80s Synthwave', 'Superhero', 3, 2, 12, 'Instant', 'Threading a needle while flying', 'Shibu coming back', 'Wears cape under casual shirt', 'Saves the village from disasters', 'Ee Kurukkanmoolayil ithu nadakkilla!', 'How to fix spandex suit tear', TRUE, 'Ex moved to the US', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
),
(
  'a0000000-0000-4000-a000-000000000004', 'murugan@puliyoor.com', 'pulimurugan', 'Puli Murugan', 35, 'Male', 'Puliyoor Forest', 'https://upload.wikimedia.org/wikipedia/en/9/91/Pulimurugan_poster.jpg', 'Can fight tigers with bare hands, but afraid to send a ''Hi'' text to a girl.', 'Hunting Tigers, Lorry Driving, Forest Survival, Village Feasts', 'Fearless, Simple, Family Man', 'Sharpening vel (spear)', 'Wild Boar Curry', 10, 'Brown', 'Tiger', 'Chenda Melam', 'Action', 1, 0, 2, '1 week', 'Tiger roar imitation', 'City traffic', 'Smells like forest mud', 'Will protect you from wild animals', 'Puli varunne!', 'High speed lorry mechanic near me', TRUE, 'Busy fighting man-eaters', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
),
(
  'a0000000-0000-4000-a000-000000000005', 'pooja@ohmshanthi.com', 'poojamathew', 'Pooja Mathew', 24, 'Female', 'Kottayam', 'https://i.pravatar.cc/300?u=poojamathew', 'Stalked my crush for 7 years until he finally married me. Persistence level: 100/100.', 'Kung Fu, Stalking, Wine Making, Agriculture', 'Obsessive, Energetic, Determined', 'Riding bicycle past Giri''s house', 'Kottayam Duck Roast', 3, 'Pink', 'Puppy', 'Romantic Pop', 'Rom-Com', 5, 3, 45, '2 minutes', 'Memorizing Giri''s weekly schedule', 'Giri liking someone else', 'Borderline stalker', 'Learned Kung Fu just to impress', 'Giri chettan!', 'How to make organic wine at home', TRUE, 'Waiting for Giri chettan to notice', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
),
(
  'a0000000-0000-4000-a000-000000000006', 'madhavan@thieflife.com', 'meeshamadhavan', 'Meesha Madhavan', 27, 'Male', 'Cheekattu', 'https://i.pravatar.cc/300?u=meeshamadhavan', 'Famous local thief with high ethics. I only steal from rich villains and heartless moneylenders.', 'Lock Picking, Mustache Twirling, Night Strolls, Pranks', 'Charming, Witty, Cunning', 'Twirling mustache clockwise', 'Steamed Banana & Payasam', 13, 'Red', 'Black Cat', 'Folk Fusion', 'Comedy Thriller', 3, 0, 15, 'At midnight', 'Opening lock with hairpin in 2 seconds', 'Bhagirathan Pillai''s traps', 'Might steal your heart (and your gold chain)', 'Gives stolen loot to the poor', 'Meesha onnu thirichal...', 'Best silver polish for stolen idols', TRUE, 'Occupational hazard of night shifts', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
),
(
  'a0000000-0000-4000-a000-000000000007', 'ramanan@punjabihouse.com', 'ramanan', 'Ramanan', 32, 'Male', 'Kochi', 'https://i.pravatar.cc/300?u=ramanan', 'Mudalali''s right-hand man. I work 24/7 on a boat, get zero salary, and get beaten up daily.', 'Crying, Boat Repair, Free Meals, Complaining', 'Dramatic, Hilarious, Unlucky', 'Sinking boats accidentally', 'Free Biryani', 0, 'Yellow', 'Fish', 'Sad Melodies', 'Slapstick Comedy', 9, 5, 0, 'Never (phone fell in sea)', 'Getting hit by oars gracefully', 'Anamala Gang', 'Completely penniless and traumatized', '100% loyal to Mudalali', 'Enthu prahasanam aanu Saji!', 'How to claim unpaid salary from boss', FALSE, 'Salary is 0 rupees per month', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
),
(
  'a0000000-0000-4000-a000-000000000008', 'appukuttan@hariharnagar.com', 'appukuttan', 'Appukuttan', 26, 'Male', 'TRight Nagar', 'https://i.pravatar.cc/300?u=appukuttan', 'Master of misunderstandings and asking dumb questions at the worst possible moments.', 'Psychology, Flirting, Group Schemes, Asking Stupid Questions', 'Foolish, Confident, Loud', 'Eavesdropping wrong information', 'Pazham Pori', 4, 'Orange', 'Donkey', '90s Film Songs', 'Comedy', 10, 4, 3, 'Confused response in 1 hour', 'Ruining secret surprise plans', 'Honest answers', 'IQ lower than room temperature', 'Always ready for group trips', 'Thomas Kutty, vitroda!', 'What does psychology mean in simple words', FALSE, 'Ruined his own date in 30 seconds', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
),
(
  'a0000000-0000-4000-a000-000000000009', 'nagavalli@thaney.com', 'nagavalli', 'Nagavalli', 25, 'Female', 'Madampally Palace', 'https://i.pravatar.cc/300?u=nagavalli', 'Classical dancer with extreme mood swings. One moment soft, next moment ''VIDAMATTE!''.', 'Bharatanatyam, Revenge, Anklets, Split Personality', 'Possessed, Dramatic, Intense', 'Dancing at 2 AM in locked room', 'Blood Orange', 100, 'Crimson Red', 'Cobra', 'Carnatic Classical', 'Psychological Horror', 2, 0, 666, 'At Durgashtami midnight', 'Lifting heavy beds with one hand when angry', 'Dr. Sunny''s psychiatric tricks', 'Might murder Sankaran Thampi in her sleep', 'Incredible classical dancer', 'Vidamatte!', 'Sankaran Thampi location 2026', TRUE, 'Scared away all suitors with ghungroo sounds', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
),
(
  'a0000000-0000-4000-a000-000000000010', 'glixon@bethlehem.com', 'glixon', 'Glixon', 27, 'Male', 'Bethlehem Estate', 'https://i.pravatar.cc/300?u=glixon', 'Living in a huge estate with 5 cousin sisters sending me anonymous romantic letters.', 'Guitars, Horses, Secret Admirers, Country Living', 'Charming, Romantic, Confused', 'Playing acoustic guitar near horses', 'Fresh Milk & Apples', 5, 'White', 'Horse', 'Acoustic Country', 'Romantic Drama', 4, 1, 77, '1 hour', 'Guessing secret letter senders', 'Finding out who sent the kitten', 'Too many female cousins in same house', 'Plays guitar and owns a farm', 'Ethu pengalaanu enikku kathu ayachathu?', 'Handwriting analysis guide free', TRUE, 'Can''t figure out which cousin loves him', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
),
(
  'a0000000-0000-4000-a000-000000000011', 'sonare@super-sharanya.com', 'sonare', 'Sona (Sonare)', 21, 'Female', 'Thrissur', 'https://i.pravatar.cc/300?u=sonare', 'Hostel queen with infinite attitude and zero patience for cringe boys.', 'Gossip, Fashion, Roasting Guys, Hostel Life', 'Sassy, Protective, High-energy', 'Giving savage nicknames to classmates', 'Shawarma & Shake', 99, 'Purple', 'Cat', 'Reels Trending Music', 'Campus Comedy', 6, 6, 120, '5 seconds or 5 days', 'Roasting someone in 3 words', 'Boring dates', 'Will roast your outfit in public', 'Protects best friend Sharanya at all costs', 'Nee aaraadee!', 'Savage replies for clingy boys on Instagram', TRUE, 'Standards are higher than Everest', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
),
(
  'a0000000-0000-4000-a000-000000000012', 'shammi@kumbalangi.com', 'shammi', 'Shammi', 33, 'Male', 'Kumbalangi', 'https://i.pravatar.cc/300?u=shammi', 'Shammi hero aada hero! Obsessed with neatness, mustache trimming, and patriarchal control.', 'Mustache Grooming, Cooking, Mirror Selfies, Control', 'Psychopathic, Obsessive, Clean Freak', 'Staring in mirror for 45 minutes', 'Home-cooked Fish Curry', 1, 'Pure White', 'Tiger', 'Eerie Background Score', 'Psychological Thriller', 3, 1, 0, 'Immediate (watching you)', 'Smiling creepily while holding a knife', 'Dust on the dining table', 'Total psycho hero complex', 'Keeps the house squeaky clean', 'Shammi hero aada hero!', 'Best mustache wax for villain look', TRUE, 'Locked up by brother-in-law''s gang', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
),
(
  'a0000000-0000-4000-a000-000000000013', 'malar@premam.com', 'malar', 'Malar Miss', 26, 'Female', 'Kodaikanal', 'https://i.pravatar.cc/300?u=malar', 'Guest lecturer who dances rowdy dance moves better than college guys.', 'Dance, Teaching, Tamil Literature, Nature', 'Sweet, Graceful, Forgotten Memories', 'Choreographing college fest dances', 'Kodaikanal Homemade Chocolate', 2, 'Sky Blue', 'Butterfly', 'Acoustic Tamil Melodies', 'Romance', 1, 1, 34, '30 minutes', 'Breakdancing in saree', 'Memory loss', 'Might forget you after a car accident', 'Makes everyone fall in love instantly', 'Enna George?', 'Kodaikanal weather update today', TRUE, 'Amnesia wiped out romantic past', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
),
(
  'a0000000-0000-4000-a000-000000000014', 'george@premam.com', 'george', 'George David', 27, 'Male', 'Aluva', 'https://i.pravatar.cc/300?u=george', 'From beard-less school lover to gang leader to cafe owner. Life is all about stages.', 'Baking, College Fights, Growing Beard, Red Wine', 'Moody, Romantic, Brooding', 'Baking red velvet cakes', 'Red Velvet Cake', 3, 'Dark Blue', 'Black Dog', 'Melancholic Rock', 'Coming-of-age Romance', 2, 2, 18, '20 minutes', 'Walking in slow motion with friends', 'Heartbreak #4', 'Becomes a different person every 5 years', 'Runs a successful pastry shop', 'Kalippu katta kalippu!', 'How to trim thick beard properly', TRUE, 'Previous 3 love stories failed spectacularly', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
),
(
  'a0000000-0000-4000-a000-000000000015', 'clara@thoovanathumbikal.com', 'clara', 'Clara', 26, 'Female', 'Thrissur', 'https://i.pravatar.cc/300?u=clara', 'Poetic soul who appears like rain and vanishes without leaving a trace.', 'Rain, Poetry, Long Distance Calls, Solitude', 'Mysterious, Melancholic, Romantic', 'Watching rain from wooden balcony', 'Hot Tea & Parippuvada', 8, 'Rainy Grey', 'Peacock', 'Violin Instrumental', 'Classic Drama', 2, 1, 5, 'Only when it rains', 'Predicting rain by smell of earth', 'Attachment', 'Will ghost you forever when the sun comes out', 'Extremely poetic and deeply romantic', 'Mazha peyyunundallo...', 'Monsoon forecast Thrissur 2026', TRUE, 'Prefers freedom over commitment', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
),
(
  'a0000000-0000-4000-a000-000000000016', 'dasan@nadodikkattu.com', 'dasan', 'Ramlal (Dasan)', 30, 'Male', 'Chennai (thinking Dubai)', 'https://i.pravatar.cc/300?u=dasan', 'B.Com graduate with 1st class. Left for Dubai on a wooden boat, landed in Chennai by mistake.', 'Dubai Dreams, Fraud Companies, B.Com Degree, Arguing with Vijayan', 'Ambitious, Unfortunate, Bossy', 'Polishing sole pair of leather shoes', 'Masala Dosa', 1, 'Brown', 'Camel', '80s Classical Comedy', 'Satire', 7, 5, 2, '4 hours', 'Flexing B.Com degree when unemployed', 'Ananthan Nambiar''s thugs', 'Thinks Chennai is Dubai', 'Never gives up despite 100 failures', 'Vijaya, namukku enthaada ingane?', 'How to know if I am in Dubai or Chennai', FALSE, 'No job, no money, no visa', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
),
(
  'a0000000-0000-4000-a000-000000000017', 'vijayan@nadodikkattu.com', 'vijayan', 'Vijayan', 29, 'Male', 'Chennai', 'https://i.pravatar.cc/300?u=vijayan', 'Dasan''s sidekick. Sick and tired of Dasan''s superior B.Com attitude.', 'CID Work, Fighting Dasan, Cow Farming, Free Tea', 'Sarcastic, Loyal, Realistic', 'Pointing out Dasan''s mistakes', 'Porotta & Beef', 2, 'Green', 'Cow', 'Folk Comedy', 'Buddy Comedy', 8, 3, 1, '30 minutes', 'Disguising as CID officer', 'Dasan''s new business ideas', 'Always complaining about roommate', 'Loyal friend who stays through poverty', 'Ellathinum athinteyathaaya kaaranam undu Dasappa!', 'CID officer salary in Tamil Nadu', FALSE, 'Living in a 1-room house with Dasan', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
),
(
  'a0000000-0000-4000-a000-000000000018', 'girirajan@premam.com', 'girirajankozhi', 'Girirajan Kozhi', 28, 'Male', 'Kochi', 'https://i.pravatar.cc/300?u=girirajankozhi', 'Professional playboy on Facebook. I propose to 50 girls daily via DM.', 'Facebook DMs, Flirting, Ray-Ban Sunglasses, Creepy Poems', 'Desperate, Flirty, Delusional', 'Sending ''Hi dear beautiful'' to random profiles', 'Chicken Biryani', 69, 'Red', 'Rooster', 'Cheesy Love Songs', 'Rom-Com', 10, 0, 0, '0.1 seconds', 'Writing cringey love poems in 10 seconds', 'Getting blocked by female profiles', 'DMs your entire female friend list', 'High self-confidence', 'Hi dear, nice profile pic!', 'Best cute comments for girls Facebook photo', FALSE, 'Creeped out every girl in South India', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
),
(
  'a0000000-0000-4000-a000-000000000019', 'sethu@kireedam.com', 'sethumadhavan', 'Sethumadhavan', 25, 'Male', 'Trivandrum', 'https://i.pravatar.cc/300?u=sethumadhavan', 'Wanted to become a police officer to make my dad proud, but destiny turned me into a rowdy.', 'Police Training, Family Honor, Tragic Fights, Solitude', 'Tragic, Heroic, Emotional', 'Looking at police uniform in wardrobe', 'Rice & Fish Curry', 100, 'Khaki', 'German Shepherd', 'Tragic Orchestral', 'Tragic Drama', 2, 1, 4, '1 hour', 'Accidentally defeating local rowdies', 'Disappointing father', 'Magnet for tragedy and bad luck', 'Deeply respectful towards parents', 'Ente achante swapnam aayirunnu...', 'How to clear rowdy record for police selection', TRUE, 'Life spiraled into uncontrollable tragedy', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
),
(
  'a0000000-0000-4000-a000-000000000020', 'mary@premam.com', 'mary', 'Mary George', 23, 'Female', 'Aluva', 'https://i.pravatar.cc/300?u=mary', 'School crush of every boy in Aluva. Used to ask boys to walk me home for protection from dogs.', 'Walking Home, Cycling, Sweets, School Romance', 'Sweet, Naive, Popular', 'Walking along Aluva river banks', 'Ice Cream', 5, 'Pink', 'Dog', 'Romantic Melodies', 'Romantic Comedy', 4, 2, 88, '10 minutes', 'Getting 10 schoolboys to carry schoolbag', 'Stray dogs', 'Friendzones everyone who helps her', 'Super polite and charming', 'Enne veedu vare aakkamo?', 'How to deal with stray dogs on road', TRUE, 'Married someone else after school', '2026-01-01T10:00:00Z', '2026-01-01T10:00:00Z'
);
