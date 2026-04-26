const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const { Quiz } = require('./models/Quiz');
const { Exam } = require('./models/Exam');
const User = require('./models/User');

dotenv.config();

const courses = [
  {
    title: 'Online Safety',
    description: 'Learn how to protect yourself and others in digital spaces. Covers passwords, phishing, and secure browsing.',
    category: 'safety', icon: '🛡️', color: '#10b981', colorBg: '#d1fae5',
    difficulty: 'Beginner', totalLessons: 10, estimatedTime: 90, xpReward: 200,
    studyGuide: `# Online Safety — Study Guide\n\n## Key Concepts\n1. **Strong Passwords** — 12+ chars, mixed case, numbers, symbols. Use a password manager.\n2. **Phishing** — Fraudulent messages pretending to be trusted sources. Check sender, hover links.\n3. **HTTPS** — Secure connections. Never enter sensitive data on HTTP sites.\n4. **Two-Factor Auth (2FA)** — Extra verification beyond password. Enable on every critical account.\n5. **Public Wi-Fi** — Use VPN. Avoid banking/shopping on public networks.\n6. **Software Updates** — Patch security vulnerabilities. Enable auto-updates.\n7. **Identity Theft** — Monitor accounts, shred documents, freeze credit if compromised.\n\n## Exam Tips\n- Know the difference between malware types (virus, ransomware, spyware)\n- Understand what makes a URL suspicious (misspelling, HTTP, weird domain)\n- Remember: 2FA adds a *second* layer — it doesn't replace passwords`,
    usefulLinks: [
      { title: 'Google Safety Center', url: 'https://safety.google', description: 'Google\'s official safety resources' },
      { title: 'Have I Been Pwned', url: 'https://haveibeenpwned.com', description: 'Check if your email was in a data breach' },
      { title: 'StaySafeOnline.org', url: 'https://staysafeonline.org', description: 'National Cybersecurity Alliance resources' },
    ],
    lessons: [
      { title: 'Introduction to Online Safety', content: 'What does it mean to be safe online? We explore the core principles of digital safety, why it matters in daily life, and how threats have evolved with technology. Today digital safety is as important as physical safety.', notes: '**Key takeaway:** Safety online means protecting your identity, data, devices, and relationships. Think of it as locking your digital doors.', week: 1, dayOfWeek: 1, order: 1, duration: 8 },
      { title: 'Strong Passwords', content: 'Creating and managing secure passwords. Learn what makes a password strong, how password managers work, and why reusing passwords across sites is dangerous. A single compromised password can unlock your entire digital life.', notes: '**Rule:** Minimum 12 characters. Use a phrase like "Coffee@3pm!Daily" — memorable but strong. Never reuse. Use Bitwarden or 1Password.', week: 1, dayOfWeek: 2, order: 2, duration: 7 },
      { title: 'Recognizing Phishing', content: 'How to spot and avoid phishing attacks. We cover email, SMS (smishing), and social media phishing tactics with real-world examples. Phishing is responsible for 90% of data breaches worldwide.', notes: '**Red flags:** Urgency, misspelled domains, requests for passwords, generic greetings ("Dear User"), suspicious attachments. Always verify before clicking.', week: 1, dayOfWeek: 3, order: 3, duration: 10 },
      { title: 'Safe Browsing Habits', content: 'HTTPS, suspicious links, and browser settings. Learn how to verify website security and avoid dangerous downloads. Your browser is a gateway — keep it protected.', notes: '**Check for:** 🔒 padlock icon, https://, exact domain spelling. Use uBlock Origin, keep browser updated, clear cookies regularly.', week: 1, dayOfWeek: 4, order: 4, duration: 8 },
      { title: 'Social Media Privacy', content: 'Managing privacy on social platforms. Review privacy settings, what to share publicly vs privately, and how your data is monetized by platforms.', notes: '**Audit checklist:** Set profiles to private, disable location sharing, review third-party app permissions, don\'t share travel plans publicly.', week: 1, dayOfWeek: 5, order: 5, duration: 9 },
      { title: 'Two-Factor Authentication', content: 'Adding an extra layer of security. Understand how 2FA works — authenticator apps, SMS codes, hardware keys — and how to enable it across your accounts.', notes: '**Best practice:** Use an authenticator app (Google Authenticator, Authy) over SMS — SMS can be SIM-swapped. Enable 2FA on email, banking, and social media first.', week: 2, dayOfWeek: 1, order: 6, duration: 7, videoUrl: 'https://www.youtube.com/watch?v=0mvCeNsTa1g' },
      { title: 'Public Wi-Fi Risks', content: 'Staying safe on public networks. Learn about man-in-the-middle attacks, packet sniffing, and how VPNs encrypt your traffic on untrusted networks.', notes: '**Rule:** Never do banking or shopping on public Wi-Fi without a VPN. A VPN creates an encrypted tunnel. Free options: ProtonVPN. Paid: NordVPN, ExpressVPN.', week: 2, dayOfWeek: 2, order: 7, duration: 8 },
      { title: 'Device Security', content: 'Keeping your devices protected. Software updates, antivirus, screen locks, and encryption basics for phones and computers.', notes: '**Essentials:** Enable full-disk encryption (FileVault/BitLocker), set auto-lock to 1 minute, use strong PIN not fingerprint-only, install updates within 24 hours.', week: 2, dayOfWeek: 3, order: 8, duration: 9 },
      { title: 'Identity Theft Prevention', content: 'How identity theft happens and how to prevent it. Recognizing warning signs and the exact steps to take if your identity is compromised.', notes: '**Prevention:** Monitor credit reports monthly, use unique email aliases per service, shred physical documents, freeze credit at all 3 bureaus if at risk.', week: 2, dayOfWeek: 4, order: 9, duration: 10 },
      { title: 'Safe Online Shopping', content: 'Shopping securely online. Verified sellers, secure payment methods, recognizing scam stores, and using virtual card numbers for added protection.', notes: '**Safe checkout:** Look for https, pay via PayPal or virtual card, check seller reviews, avoid wire transfers, save order confirmations. Use privacy.com for virtual cards.', week: 2, dayOfWeek: 5, order: 10, duration: 8 },
    ],
  },
  {
    title: 'Ethical Communication',
    description: 'Develop skills for respectful, honest, and constructive communication in digital environments.',
    category: 'ethics', icon: '💬', color: '#4f46e5', colorBg: '#ede9fe',
    difficulty: 'Intermediate', totalLessons: 10, estimatedTime: 75, xpReward: 180,
    studyGuide: `# Ethical Communication — Study Guide\n\n## Core Principles\n1. **Netiquette** — Treat others online as you would in person. The Golden Rule applies digitally.\n2. **Tone Awareness** — Text strips 70% of communication (no voice, no face). Add context.\n3. **Constructive Disagreement** — Critique ideas, not people. Use "I" statements.\n4. **Misinformation** — Verify with 3 credible sources before sharing. SIFT method.\n5. **Digital Empathy** — Real people with real feelings are behind every screen.\n\n## Exam Tips\n- Distinguish between debate, argument, and harassment\n- Know the SIFT method steps by heart\n- Understand why tone is harder to read in text`,
    usefulLinks: [
      { title: 'Common Sense Media', url: 'https://www.commonsensemedia.org', description: 'Digital citizenship resources for all ages' },
      { title: 'Digital Citizenship Institute', url: 'https://digitalcitizenship.net', description: 'Nine elements of digital citizenship' },
      { title: 'MediaWise', url: 'https://www.poynter.org/mediawise', description: 'Fact-checking and media literacy from Poynter' },
    ],
    lessons: [
      { title: 'Principles of Online Etiquette', content: 'Netiquette and respectful communication. What it means to be a considerate digital citizen in every interaction — from emails to social media comments to group chats.', notes: '**Netiquette rules:** Don\'t type in ALL CAPS (it\'s shouting). Respond within 24 hours to messages. Don\'t overshare private information. Credit others\' work.', week: 1, dayOfWeek: 1, order: 1, duration: 8 },
      { title: 'Tone & Context Online', content: 'How tone is perceived in text-based communication. Why the same message can mean completely different things to different readers — and how to write with clarity and warmth.', notes: '**Tip:** Re-read messages before sending. Use punctuation intentionally. "Fine." vs "Fine!" have completely different tones. Emojis can clarify intent when appropriate.', week: 1, dayOfWeek: 2, order: 2, duration: 9 },
      { title: 'Constructive Disagreement', content: 'How to disagree respectfully online. Techniques for engaging in meaningful, productive debate without letting it become hostile or personal.', notes: '**Framework:** (1) Acknowledge the other view. (2) State your position with evidence. (3) Avoid personal attacks. (4) Know when to disengage. Disagreement ≠ disrespect.', week: 1, dayOfWeek: 3, order: 3, duration: 10 },
      { title: 'Misinformation & Fact Checking', content: 'Identifying and combating misinformation. How to verify sources, use the SIFT method, and stop the spread of false information in your networks.', notes: '**SIFT Method:** Stop — pause before sharing. Investigate the source. Find better coverage. Trace claims. Reliable fact-checkers: Snopes, FactCheck.org, AFP Fact Check.', week: 1, dayOfWeek: 4, order: 4, duration: 11 },
      { title: 'Digital Empathy', content: 'Understanding others\' perspectives online. How to practice empathy when you can\'t see someone\'s face — reading emotional context and responding with care.', notes: '**Practice:** Before responding to an upsetting message, ask "What might they be going through?" Give benefit of the doubt. Pause before reacting.', week: 1, dayOfWeek: 5, order: 5, duration: 8 },
      { title: 'Inclusive Language', content: 'Using language that respects all people. How words can include or exclude, why inclusive language matters online, and practical alternatives to exclusionary terms.', notes: '**Key principle:** Language shapes culture. Small changes (using someone\'s correct pronouns, avoiding stereotypes) signal respect and belonging to others.', week: 2, dayOfWeek: 1, order: 6, duration: 9 },
      { title: 'Handling Negative Interactions', content: 'Responding to hostility, trolls, and harassment. De-escalation techniques and knowing when to disengage, block, or report rather than engage.', notes: '**Decision tree:** Can I respond calmly? → Respond. Is this harassment? → Document, block, report. Is this a troll? → Don\'t feed it. Silence is a valid choice.', week: 2, dayOfWeek: 2, order: 7, duration: 10 },
      { title: 'Giving & Receiving Feedback', content: 'Constructive feedback in digital spaces — written and asynchronous. How to be honest without being hurtful, and receive feedback without getting defensive.', notes: '**SBI Framework:** Situation — Behavior — Impact. "In yesterday\'s meeting (S), when you interrupted me (B), I felt my input wasn\'t valued (I)."', week: 2, dayOfWeek: 3, order: 8, duration: 8 },
      { title: 'Professional Online Communication', content: 'Email, messaging, and professional platforms. The difference between casual and professional digital communication and how to switch between them.', notes: '**Professional email:** Clear subject line, proper greeting, one topic per email, professional sign-off. Response SLA: 24 hours business days. Proofread everything.', week: 2, dayOfWeek: 4, order: 9, duration: 9 },
      { title: 'Building Your Digital Reputation', content: 'Your digital footprint shapes how others see you professionally and personally. Learn to build a positive, intentional online presence that reflects your values.', notes: '**Audit yourself:** Google your name. Review your oldest social media posts. What does your online presence say about you? Future employers will check.', week: 2, dayOfWeek: 5, order: 10, duration: 9 },
    ],
  },
  {
    title: 'Data Privacy',
    description: 'Understand how your personal data is collected, used, and how to protect it.',
    category: 'privacy', icon: '🔐', color: '#f59e0b', colorBg: '#fef3c7',
    difficulty: 'Intermediate', totalLessons: 10, estimatedTime: 70, xpReward: 160,
    studyGuide: `# Data Privacy — Study Guide\n\n## Key Concepts\n1. **PII** — Personally Identifiable Information. Name, address, phone, email, IP address, biometrics.\n2. **Data Collection** — Cookies, trackers, data brokers, loyalty programs, apps all collect your data.\n3. **GDPR Rights** — Access, Rectification, Erasure (Right to be Forgotten), Portability, Object.\n4. **Data Breach** — Unauthorized access to personal data. Steps: change passwords, enable 2FA, monitor accounts.\n5. **Data Minimization** — Share only what's necessary. More shared = more at risk.\n\n## Exam Tips\n- Distinguish between first-party and third-party cookies\n- Know the 5 GDPR individual rights\n- Understand why metadata can be as revealing as content`,
    usefulLinks: [
      { title: 'EFF: Privacy Guides', url: 'https://www.eff.org/issues/privacy', description: 'Electronic Frontier Foundation privacy resources' },
      { title: 'Privacy.com', url: 'https://privacy.com', description: 'Virtual card numbers for safer online purchases' },
      { title: 'GDPR.eu', url: 'https://gdpr.eu', description: 'Official GDPR information and guides' },
    ],
    lessons: [
      { title: 'What is Personal Data?', content: 'Types of personal data and why they matter. From obvious identifiers like names and addresses to subtle ones like IP addresses, browser fingerprints, and behavioural patterns.', notes: '**PII categories:** Direct (name, ID), Quasi-identifiers (zip code, age, gender — combine to identify), Sensitive (health, finances, religion). All deserve protection.', week: 1, dayOfWeek: 1, order: 1, duration: 8 },
      { title: 'How Data is Collected', content: 'Cookies, tracking pixels, data brokers, loyalty cards, and apps. The invisible infrastructure that monitors your every digital move — and sometimes your physical movement too.', notes: '**Reality check:** 100+ trackers can be on a single website. Your supermarket loyalty card is a data collection device. Your phone\'s apps share location with advertisers.', week: 1, dayOfWeek: 2, order: 2, duration: 10 },
      { title: 'Your GDPR Rights', content: 'Your legal rights under data protection laws. The right to access, correct, delete, and port your personal data — and how to exercise them against companies.', notes: '**5 Rights:** (1) Access — request your data. (2) Rectification — correct errors. (3) Erasure — request deletion. (4) Portability — get your data. (5) Object — opt out of processing.', week: 1, dayOfWeek: 3, order: 3, duration: 12 },
      { title: 'Cookie Consent', content: 'Understanding and managing cookie settings. What different cookie categories mean, why "Accept All" is risky, and how to make informed, privacy-protective choices.', notes: '**Cookie types:** Strictly necessary (can\'t refuse), Functional (preferences), Analytics (tracking), Marketing (advertising profiling). Only accept what you need.', week: 1, dayOfWeek: 4, order: 4, duration: 8 },
      { title: 'Data Minimization', content: 'Sharing less to protect more. Why providing only the minimum necessary information limits your exposure when companies suffer data breaches.', notes: '**Principle:** If a form asks for your birthday and doesn\'t need it — don\'t fill it in. Use an alias email for newsletters. Give false dates of birth on non-financial sites.', week: 1, dayOfWeek: 5, order: 5, duration: 9 },
      { title: 'Privacy Settings Audit', content: 'A practical walkthrough of reviewing and strengthening privacy settings across major platforms — Google, Facebook, Instagram, your phone\'s OS, and your browser.', notes: '**Do today:** Google: myaccount.google.com/privacy → turn off Web & App Activity. iPhone: Settings → Privacy → Location Services → audit each app.', week: 2, dayOfWeek: 1, order: 6, duration: 11 },
      { title: 'Data Breaches', content: 'How breaches happen, what\'s at risk, and exactly what to do when your data is exposed. From credential stuffing to database dumps — understanding the landscape.', notes: '**Response checklist:** (1) Change password immediately. (2) Enable 2FA. (3) Check haveibeenpwned.com. (4) Monitor bank statements. (5) Consider credit freeze if financial data exposed.', week: 2, dayOfWeek: 2, order: 7, duration: 10 },
      { title: 'Social Media Data Practices', content: 'What social platforms actually do with your data. Ad targeting, shadow profiles, data sharing with third parties, and what deleting your account actually deletes.', notes: '**Reality:** Deleting your Facebook account doesn\'t delete your shadow profile built from other users\' contacts and activity. Your data may persist for up to 90 days after deletion.', week: 2, dayOfWeek: 3, order: 8, duration: 9 },
      { title: 'Protecting Children\'s Privacy', content: 'Special considerations for children\'s online privacy. COPPA, parental controls, age-appropriate digital literacy, and why children\'s data deserves extra protection.', notes: '**COPPA:** Children under 13 require parental consent for data collection in the US. Platforms must not target children with ads. Parents: review all apps your child uses.', week: 2, dayOfWeek: 4, order: 9, duration: 8 },
      { title: 'Encryption Basics', content: 'How encryption protects your data in transit and at rest. HTTPS, end-to-end encryption in messaging apps, full-disk encryption, and why it matters for privacy.', notes: '**Use:** Signal or WhatsApp for E2E encrypted messaging. Proton Mail for encrypted email. Enable FileVault (Mac) or BitLocker (Windows). Encryption is your last line of defence.', week: 2, dayOfWeek: 5, order: 10, duration: 9 },
    ],
  },
  {
    title: 'Cyberbullying Awareness',
    description: 'Recognize, prevent, and respond to cyberbullying. Build empathy and digital resilience.',
    category: 'cyberbullying', icon: '🚫', color: '#ef4444', colorBg: '#fee2e2',
    difficulty: 'Beginner', totalLessons: 10, estimatedTime: 60, xpReward: 150,
    studyGuide: `# Cyberbullying Awareness — Study Guide\n\n## Key Definitions\n- **Cyberbullying:** Repeated harmful behaviour using digital technology targeting a specific person\n- **Cyberstalking:** Persistent monitoring/harassment online\n- **Doxxing:** Publishing private info about someone without consent\n- **Bystander Effect:** Tendency to not intervene when others are present\n\n## Response Framework\n1. **Don't retaliate** — escalation makes it worse\n2. **Document** — screenshots with timestamps\n3. **Block & Report** — use platform tools\n4. **Tell someone** — trusted adult, counselor, or authority\n5. **Seek support** — mental health resources\n\n## Exam Tips\n- Know the difference between cyberbullying and disagreement\n- Understand the bystander's role and responsibility\n- Recall the emotional impact and long-term effects`,
    usefulLinks: [
      { title: 'StopBullying.gov', url: 'https://www.stopbullying.gov', description: 'Official US government anti-bullying resources' },
      { title: 'Cyberbullying Research Center', url: 'https://cyberbullying.org', description: 'Research, resources, and reporting tools' },
      { title: 'Crisis Text Line', url: 'https://www.crisistextline.org', description: 'Text HOME to 741741 for free crisis support' },
    ],
    lessons: [
      { title: 'What is Cyberbullying?', content: 'Definitions, types, and real-world impact. How cyberbullying differs from traditional bullying — the 24/7 nature, the audience scale, and the permanence of digital evidence make it uniquely damaging.', notes: '**Types:** Harassment, flaming, outing, exclusion, impersonation, cyberstalking, doxxing. Key factor: it\'s *repeated* and *intentional* — a one-time argument is not cyberbullying.', week: 1, dayOfWeek: 1, order: 1, duration: 9 },
      { title: 'Recognizing the Signs', content: 'How to identify if someone — a friend, sibling, or student — is being bullied online. Behavioural and emotional warning signs that something is wrong.', notes: '**Warning signs:** Becomes upset after using devices, withdraws from friends, avoids school/social situations, unexplained mood swings, stops using devices suddenly.', week: 1, dayOfWeek: 2, order: 2, duration: 8 },
      { title: 'How to Respond as a Target', content: 'Practical steps if you or someone you know is experiencing cyberbullying — from immediate actions to long-term recovery strategies.', notes: '**Immediate steps:** Don\'t respond to the bully. Screenshot everything with timestamps. Block on all platforms. Report to platform. Tell a trusted adult. Contact authorities if threats are made.', week: 1, dayOfWeek: 3, order: 3, duration: 10 },
      { title: 'Bystander Responsibility', content: 'The critical role bystanders play in cyberbullying. The bystander effect online and how witnessing — and doing nothing — contributes to harm. How to safely intervene.', notes: '**Bystander actions:** Don\'t share or like bullying content (amplifying it causes more harm). Privately support the victim. Report the content. Include the excluded. Speak to an adult.', week: 1, dayOfWeek: 4, order: 4, duration: 9 },
      { title: 'The Psychology of Online Aggression', content: 'Why people bully online — the disinhibition effect, anonymity, and the lack of visible consequences. Understanding the "why" helps prevent and respond effectively.', notes: '**Online disinhibition:** People say online what they\'d never say in person because they can\'t see the immediate impact. This doesn\'t excuse it — it explains it.', week: 1, dayOfWeek: 5, order: 5, duration: 10 },
      { title: 'Impact on Mental Health', content: 'The psychological effects of cyberbullying — anxiety, depression, academic decline, and in severe cases, self-harm. Why early intervention is critical.', notes: '**Key data:** Cyberbullying victims are 2x more likely to attempt self-harm. Early support significantly reduces long-term impact. Mental health is not weakness — seek help.', week: 2, dayOfWeek: 1, order: 6, duration: 10 },
      { title: 'Reporting & Platform Tools', content: 'How to use every major platform\'s reporting features effectively. Documenting evidence properly and escalating when platforms don\'t respond.', notes: '**Reporting checklist:** Screenshot + timestamp, note URL, report within platform, report to school if involves classmates, contact police if threats of violence occur.', week: 2, dayOfWeek: 2, order: 7, duration: 8 },
      { title: 'Empathy & Digital Kindness', content: 'Building a culture of kindness online. How small positive actions — a supportive comment, including someone, standing up — can change someone\'s day or even save a life.', notes: '**The challenge:** One kind comment takes 5 seconds. It can mean everything to someone who is struggling. The world online reflects the world we choose to build.', week: 2, dayOfWeek: 3, order: 8, duration: 9 },
      { title: 'Building Digital Resilience', content: 'Developing emotional resilience against online negativity. Strategies for protecting your mental health, setting boundaries, and maintaining confidence in digital spaces.', notes: '**Resilience habits:** Curate your feed ruthlessly. Take regular digital breaks. Separate online opinion from self-worth. Have offline relationships. Physical activity helps.', week: 2, dayOfWeek: 4, order: 9, duration: 9 },
      { title: 'Prevention & Community Standards', content: 'How communities, schools, and platforms can prevent cyberbullying through policy, education, and creating cultures where it is unacceptable. Your role in building safer spaces.', notes: '**Community action:** Establish clear norms in your groups. Call out bullying behaviour calmly. Create welcoming environments. Prevention is always better than response.', week: 2, dayOfWeek: 5, order: 10, duration: 8 },
    ],
  },
  {
    title: 'Digital Literacy',
    description: 'Navigate information, media, and digital tools with critical thinking and confidence.',
    category: 'literacy', icon: '📚', color: '#8b5cf6', colorBg: '#f3e8ff',
    difficulty: 'Beginner', totalLessons: 10, estimatedTime: 80, xpReward: 170,
    studyGuide: `# Digital Literacy — Study Guide\n\n## Core Skills\n1. **Source Evaluation** — SIFT: Stop, Investigate, Find better coverage, Trace claims\n2. **Algorithm Literacy** — Understand how feeds are curated and how to break filter bubbles\n3. **AI & Deepfakes** — Detecting synthetic media; understanding AI limitations\n4. **Digital Footprint** — Permanent, searchable, affects employment and relationships\n5. **Copyright** — Know what you can and can\'t use and how to attribute\n\n## Exam Tips\n- Steps of the SIFT method in order\n- What a filter bubble is and how to escape one\n- Difference between copyright, fair use, and Creative Commons`,
    usefulLinks: [
      { title: 'Web Literacy Map (Mozilla)', url: 'https://foundation.mozilla.org/en/initiatives/web-literacy', description: 'Mozilla\'s comprehensive web literacy framework' },
      { title: 'SIFT Method Guide', url: 'https://cor.stanford.edu/curriculum/collections/sift', description: 'Stanford SIFT fact-checking curriculum' },
      { title: 'FotoForensics', url: 'https://fotoforensics.com', description: 'Analyze images for manipulation' },
    ],
    lessons: [
      { title: 'What is Digital Literacy?', content: 'Digital literacy means the ability to find, evaluate, create, and communicate information using digital technologies. In 2025, it\'s as fundamental as reading and writing.', notes: '**Core pillars:** Find (locate information), Evaluate (assess credibility), Create (produce digital content responsibly), Communicate (share ethically and effectively).', week: 1, dayOfWeek: 1, order: 1, duration: 7 },
      { title: 'Evaluating Online Sources', content: 'How to assess the credibility of online information. The SIFT method, domain analysis, checking publication dates, and identifying author credentials.', notes: '**SIFT:** Stop (pause before sharing/believing), Investigate the source (who publishes this?), Find better coverage (lateral reading), Trace claims (follow to original source).', week: 1, dayOfWeek: 2, order: 2, duration: 10 },
      { title: 'Understanding Algorithms', content: 'How recommendation systems shape what you see online. Filter bubbles, echo chambers, engagement-optimised feeds, and how to actively diversify your information diet.', notes: '**Break your bubble:** Actively seek sources that challenge your views. Use incognito mode for neutral search results. Follow people with different perspectives. Vary your news sources.', week: 1, dayOfWeek: 3, order: 3, duration: 9 },
      { title: 'AI & Synthetic Media', content: 'Understanding AI-generated content, deepfakes, and voice cloning. How to spot synthetic media — and why it increasingly requires tools, not just human perception.', notes: '**Detection clues:** Deepfakes: odd lighting on face edges, unnatural blinking, hair inconsistencies. AI text: unnaturally even tone, lack of specific details, no errors. Use FotoForensics for images.', week: 1, dayOfWeek: 4, order: 4, duration: 11, videoUrl: 'https://www.youtube.com/watch?v=oxXpB9pSETo' },
      { title: 'Your Digital Footprint', content: 'Everything you do online leaves a permanent, searchable trail. How employers, universities, and governments use this data — and how to manage your digital reputation proactively.', notes: '**Fact:** 70% of employers screen candidates on social media. Posts from years ago can surface. Google yourself quarterly. Use privacy tools. Think before posting: "Would I show this to my future employer?"', week: 1, dayOfWeek: 5, order: 5, duration: 8 },
      { title: 'Copyright & Creative Commons', content: 'Using and sharing digital content legally. Understanding copyright, fair use, Creative Commons licensing, and what happens when you violate intellectual property rights.', notes: '**Licenses:** CC0 (public domain), CC BY (credit required), CC BY-SA (share alike), CC BY-NC (non-commercial only). Always credit sources. "I found it online" doesn\'t mean it\'s free to use.', week: 2, dayOfWeek: 1, order: 6, duration: 9 },
      { title: 'Online Research Skills', content: 'Advanced strategies for effective online research. Search operators, academic databases, identifying primary vs secondary sources, and avoiding research rabbit holes.', notes: '**Search operators:** "exact phrase", site:edu, -exclude, filetype:pdf, before:2024. Academic sources: Google Scholar, JSTOR, PubMed. Primary sources are always more authoritative.', week: 2, dayOfWeek: 2, order: 7, duration: 10 },
      { title: 'Media Literacy', content: 'Critically consuming news and media. How to analyze bias, recognize propaganda techniques, understand media ownership, and consume news without being manipulated.', notes: '**Bias check:** AllSides.com shows political bias of news sources. Read left, right, and centre on important stories. Distinguish news from opinion. Headlines are written to provoke — read the article.', week: 2, dayOfWeek: 3, order: 8, duration: 10 },
      { title: 'Creating Responsible Digital Content', content: 'How to create and share digital content ethically — crediting sources, representing information accurately, considering your audience, and the responsibility that comes with reach.', notes: '**Creator responsibilities:** Verify before publishing. Credit all sources. Label opinions as opinions. Consider whether sharing helps or harms. Your reach = your responsibility.', week: 2, dayOfWeek: 4, order: 9, duration: 9 },
      { title: 'Digital Citizenship Rights & Responsibilities', content: 'Your rights as a digital citizen — freedom of expression, privacy, access to information — and the responsibilities that balance them. Building the digital world we want to live in.', notes: '**Balance:** Rights without responsibilities create chaos. Freedom of speech doesn\'t mean freedom from consequences. Online spaces are shared — treat them like public spaces you\'d want to live in.', week: 2, dayOfWeek: 5, order: 10, duration: 9 },
    ],
  },
];

const quizData = [
  {
    courseKey: 'Online Safety',
    quizzes: [
      {
        title: 'Online Safety — Quick Check',
        questions: [
          { text: 'What is phishing?', options: ['Malware that encrypts files', 'Fraudulent attempt to get sensitive info by impersonating a trusted entity', 'Unauthorized system access', 'Spam emails'], correctIndex: 1, explanation: 'Phishing tricks you into revealing sensitive info via fake trusted communications.' },
          { text: 'Which URL is safer?', options: ['http://mybank.com', 'https://mybank.com', 'http://mybank.secure.com', 'https://myb4nk.com'], correctIndex: 1, explanation: 'HTTPS encrypts the connection. Check domain matches exactly.' },
          { text: 'What makes a strong password?', options: ['Your pet\'s name', '12+ chars with uppercase, lowercase, numbers, symbols', '"Password123"', 'Your birthday'], correctIndex: 1, explanation: 'Length + complexity + uniqueness = strength.' },
          { text: 'What does 2FA add?', options: ['Longer password', 'Two devices required', 'Second verification step beyond password', 'Double encryption'], correctIndex: 2, explanation: '2FA adds a second factor so stolen passwords alone aren\'t enough.' },
        ],
        xpReward: 85, passingScore: 70,
      },
    ],
  },
  {
    courseKey: 'Ethical Communication',
    quizzes: [
      {
        title: 'Ethical Communication Check',
        questions: [
          { text: 'Why is tone misunderstood in text?', options: ['People type fast', 'Text lacks vocal cues and facial expressions', 'Autocorrect', 'Character limits'], correctIndex: 1, explanation: 'Non-verbal cues are absent in text-based communication.' },
          { text: 'First step against misinformation?', options: ['Share with warning', 'Ignore it', 'Verify with multiple credible sources', 'Report immediately'], correctIndex: 2, explanation: 'Verify before sharing prevents spread.' },
          { text: 'What is digital empathy?', options: ['Sending emojis', 'Understanding others\' feelings in online interactions', 'Agreeing with everything', 'Avoiding all conflict'], correctIndex: 1, explanation: 'Real people with real feelings are behind every screen.' },
        ],
        xpReward: 80, passingScore: 70,
      },
    ],
  },
  {
    courseKey: 'Data Privacy',
    quizzes: [
      {
        title: 'Data Privacy Fundamentals',
        questions: [
          { text: 'What is PII?', options: ['Only name and address', 'Any info that can identify a specific individual', 'Only financial info', 'Government database info'], correctIndex: 1, explanation: 'PII includes any data that can identify you.' },
          { text: '"Right to be forgotten" means?', options: ['Delete social media posts', 'Request company deletes your personal data', 'Remain anonymous online', 'Use a pseudonym'], correctIndex: 1, explanation: 'Right to erasure lets you request data deletion.' },
          { text: 'Tracking cookies primarily?', options: ['Speed up websites', 'Store login info', 'Monitor browsing for advertising', 'Secure connections'], correctIndex: 2, explanation: 'Tracking cookies follow you across sites to build ad profiles.' },
        ],
        xpReward: 90, passingScore: 70,
      },
    ],
  },
  {
    courseKey: 'Cyberbullying Awareness',
    quizzes: [
      {
        title: 'Cyberbullying Awareness Check',
        questions: [
          { text: 'Which is cyberbullying?', options: ['Friendly message to someone new', 'Repeatedly posting hurtful comments on someone\'s profile', 'Respectful disagreement', 'Sharing a funny meme'], correctIndex: 1, explanation: 'Cyberbullying is repeated harmful behaviour targeting a specific person.' },
          { text: 'Witnessing cyberbullying — what to do?', options: ['Join in to avoid being targeted', 'Ignore it', 'Support victim, don\'t share, and report it', 'Share to warn others'], correctIndex: 2, explanation: 'Bystanders play a critical role in stopping cyberbullying.' },
          { text: 'What is the "bystander effect"?', options: ['The tendency to not intervene when others are present', 'Directly attacking the victim', 'Reporting anonymously', 'Supporting the bully'], correctIndex: 0, explanation: 'When others are present, people assume someone else will act.' },
        ],
        xpReward: 75, passingScore: 70,
      },
    ],
  },
  {
    courseKey: 'Digital Literacy',
    quizzes: [
      {
        title: 'Digital Literacy Check',
        questions: [
          { text: 'What does the "S" in SIFT stand for?', options: ['Search', 'Stop', 'Share', 'Source'], correctIndex: 1, explanation: 'Stop — pause before sharing or believing a piece of content.' },
          { text: 'What is a "filter bubble"?', options: ['A browser security feature', 'Being shown content that only confirms your existing views', 'A type of spam filter', 'A parental control tool'], correctIndex: 1, explanation: 'Algorithms create filter bubbles by showing you what you already agree with.' },
          { text: 'CC BY license means?', options: ['Can\'t use without permission', 'Free to use if you give credit', 'Only for non-commercial use', 'Can modify but not share'], correctIndex: 1, explanation: 'CC BY = Attribution required, but otherwise free to use.' },
        ],
        xpReward: 80, passingScore: 70,
      },
    ],
  },
];

const examData = [
  {
    courseKey: 'Online Safety',
    title: 'Online Safety — Final Exam (Week 3)',
    description: 'Comprehensive assessment covering all 10 lessons. You need 60% to pass and qualify for a certificate.',
    passingScore: 60, week: 3, duration: 45,
    questions: [
      { text: 'What is the minimum recommended password length for security?', options: ['6 characters', '8 characters', '12 characters', '4 characters'], correctIndex: 2, explanation: 'Security experts recommend 12+ characters for strong passwords.' },
      { text: 'Which of the following is a sign of a phishing email?', options: ['Comes from a known colleague', 'Creates urgency and asks for your password', 'Has a professional signature', 'Was expected by you'], correctIndex: 1, explanation: 'Phishing emails create false urgency and request credentials.' },
      { text: 'What does HTTPS stand for?', options: ['HyperText Transfer Protocol Security', 'HyperText Transfer Protocol Secure', 'High Transfer Text Protocol Secure', 'Hyper Transfer Type Protocol Secure'], correctIndex: 1, explanation: 'HTTPS = HyperText Transfer Protocol Secure — encrypts data in transit.' },
      { text: 'What is two-factor authentication?', options: ['Using two passwords', 'Verifying identity with a second factor beyond your password', 'Having two accounts', 'Logging in from two devices'], correctIndex: 1, explanation: '2FA requires something you know (password) + something you have or are.' },
      { text: 'Why is public Wi-Fi risky?', options: ['It\'s slow', 'Others on the same network may intercept your traffic', 'It uses more battery', 'It blocks secure websites'], correctIndex: 1, explanation: 'Public Wi-Fi allows potential man-in-the-middle attacks.' },
      { text: 'What should you do FIRST if your account is hacked?', options: ['Delete the account', 'Change the password immediately', 'Call a friend', 'Ignore it and wait'], correctIndex: 1, explanation: 'Change your password first to regain control of the account.' },
      { text: 'What is malware?', options: ['A type of firewall', 'Software designed to damage, disrupt or gain unauthorised access to systems', 'An antivirus program', 'A secure VPN'], correctIndex: 1, explanation: 'Malware = malicious software. Includes viruses, ransomware, spyware.' },
      { text: 'Which is the safest way to pay online?', options: ['Bank transfer', 'Credit card or virtual card via secure checkout', 'Sending cash via post', 'Sharing your debit card number via email'], correctIndex: 1, explanation: 'Credit cards and virtual cards offer fraud protection and buyer protection.' },
    ],
  },
  {
    courseKey: 'Ethical Communication',
    title: 'Ethical Communication — Final Exam (Week 3)',
    description: 'Comprehensive exam on ethical digital communication. 60% required to pass.',
    passingScore: 60, week: 3, duration: 40,
    questions: [
      { text: 'What is "netiquette"?', options: ['Internet security protocol', 'Rules of etiquette for online behaviour', 'A browser setting', 'Email formatting standards'], correctIndex: 1, explanation: 'Netiquette = internet etiquette — respectful behaviour online.' },
      { text: 'The SIFT method helps with?', options: ['Password management', 'Evaluating and verifying online information', 'Encrypting messages', 'Reporting abuse'], correctIndex: 1, explanation: 'SIFT (Stop, Investigate, Find coverage, Trace) helps combat misinformation.' },
      { text: 'What does digital empathy involve?', options: ['Only communicating with known people', 'Understanding and considering others\' feelings in digital interactions', 'Using formal language always', 'Avoiding social media'], correctIndex: 1, explanation: 'Digital empathy means recognising real people\'s feelings behind screens.' },
      { text: 'What is constructive disagreement?', options: ['Refusing to engage with different opinions', 'Critiquing ideas respectfully with evidence, not attacking people', 'Ending conversations when you disagree', 'Always agreeing to keep the peace'], correctIndex: 1, explanation: 'Constructive disagreement focuses on ideas, not personal attacks.' },
      { text: 'What should you do with negative interactions?', options: ['Always respond aggressively to defend yourself', 'Assess, de-escalate or disengage, document if needed', 'Share screenshots publicly', 'Never block anyone'], correctIndex: 1, explanation: 'Assess the situation, de-escalate if possible, disengage from trolls.' },
      { text: 'Typing in ALL CAPS in a message typically signals?', options: ['Excitement', 'Shouting or strong emotion, often rude', 'Emphasis', 'Formality'], correctIndex: 1, explanation: 'ALL CAPS is internet convention for shouting and is generally considered rude.' },
    ],
  },
  {
    courseKey: 'Data Privacy',
    title: 'Data Privacy — Final Exam (Week 3)',
    description: 'Final assessment on data privacy principles and your rights. 60% to pass.',
    passingScore: 60, week: 3, duration: 45,
    questions: [
      { text: 'PII stands for?', options: ['Private Internet Information', 'Personally Identifiable Information', 'Protected Internet Identity', 'Personal Internet Interface'], correctIndex: 1, explanation: 'PII = Personally Identifiable Information — any data that can identify you.' },
      { text: 'Under GDPR, "Right to Erasure" means?', options: ['Clearing browser history', 'Requesting a company delete your personal data', 'Staying anonymous online', 'Deleting your own posts'], correctIndex: 1, explanation: 'Right to Erasure (right to be forgotten) lets you request data deletion from organisations.' },
      { text: 'What are tracking cookies used for?', options: ['Improving site speed', 'Storing login state', 'Profiling your behaviour for targeted advertising', 'Encrypting your connection'], correctIndex: 2, explanation: 'Tracking cookies follow you across sites to build advertising profiles.' },
      { text: 'Data minimisation principle means?', options: ['Storing data in small files', 'Only collecting the minimum data necessary for the stated purpose', 'Deleting old data', 'Minimising database size'], correctIndex: 1, explanation: 'Collect and share only what is necessary — less data = less risk.' },
      { text: 'What should you do first after a data breach?', options: ['Delete your account', 'Change affected passwords and enable 2FA', 'Wait and see', 'Post about it on social media'], correctIndex: 1, explanation: 'Immediately change passwords and enable 2FA to secure compromised accounts.' },
      { text: 'Which is NOT a GDPR right?', options: ['Right to access your data', 'Right to data portability', 'Right to earn payment for your data', 'Right to rectification'], correctIndex: 2, explanation: 'GDPR doesn\'t give you the right to be paid for your data.' },
    ],
  },
  {
    courseKey: 'Cyberbullying Awareness',
    title: 'Cyberbullying Awareness — Final Exam (Week 3)',
    description: 'Final exam on cyberbullying recognition, response, and prevention. 60% to pass.',
    passingScore: 60, week: 3, duration: 35,
    questions: [
      { text: 'What distinguishes cyberbullying from a one-time conflict?', options: ['The platform it occurs on', 'It involves repeated, intentional harmful behaviour targeting a specific person', 'The age of those involved', 'Whether adults are present'], correctIndex: 1, explanation: 'Cyberbullying is characterised by repetition and targeted intent.' },
      { text: 'As a bystander to cyberbullying, you should?', options: ['Join in to avoid being targeted', 'Privately support the victim, report the content, don\'t amplify it', 'Share it to raise awareness', 'Ignore it completely'], correctIndex: 1, explanation: 'Bystanders reduce harm by supporting victims and not amplifying content.' },
      { text: 'The bystander effect means?', options: ['Everyone helps in an emergency', 'When others are present, each individual is less likely to intervene', 'Bystanders always report incidents', 'People watch to learn from others'], correctIndex: 1, explanation: 'Presence of others reduces individual sense of responsibility to act.' },
      { text: 'First step if you receive cyberbullying messages?', options: ['Respond aggressively', 'Don\'t respond — document, block, and report', 'Delete your account', 'Post it publicly to shame them'], correctIndex: 1, explanation: 'Don\'t engage. Document evidence, block the bully, and report to the platform.' },
      { text: 'Doxxing means?', options: ['Editing someone\'s documents', 'Publicly revealing someone\'s private information without consent', 'Documenting evidence', 'Reporting harassment'], correctIndex: 1, explanation: 'Doxxing publishes private info (address, phone number) to enable targeted harassment.' },
    ],
  },
  {
    courseKey: 'Digital Literacy',
    title: 'Digital Literacy — Final Exam (Week 3)',
    description: 'Final exam on digital literacy, media analysis, and critical thinking online. 60% to pass.',
    passingScore: 60, week: 3, duration: 45,
    questions: [
      { text: 'What does the "I" in SIFT stand for?', options: ['Ignore', 'Investigate the source', 'Inform others', 'Integrate the information'], correctIndex: 1, explanation: 'I = Investigate the source — who is behind this information?' },
      { text: 'A filter bubble is?', options: ['A content moderation tool', 'When algorithms only show you content matching your existing views', 'Parental controls online', 'A VPN feature'], correctIndex: 1, explanation: 'Filter bubbles isolate you in a loop of confirming content, limiting perspective.' },
      { text: 'A deepfake is?', options: ['A type of strong password', 'AI-generated synthetic media making someone appear to say or do something they didn\'t', 'Deep web content', 'A deep learning firewall'], correctIndex: 1, explanation: 'Deepfakes use AI to create convincingly fake video or audio of real people.' },
      { text: 'CC BY-NC license allows?', options: ['Any use without restriction', 'Use with credit, but not for commercial purposes', 'Commercial use only', 'No use permitted'], correctIndex: 1, explanation: 'BY = attribution required. NC = non-commercial use only.' },
      { text: 'Primary sources are?', options: ['Always more reliable than all others', 'First-hand accounts or original documents from the time/event', 'Only scientific papers', 'Government documents exclusively'], correctIndex: 1, explanation: 'Primary sources are original, first-hand evidence — always preferable for research.' },
      { text: 'Your digital footprint includes?', options: ['Only photos you post', 'Everything you do online — posts, searches, messages, and more', 'Only public posts', 'Only emails you send'], correctIndex: 1, explanation: 'Your digital footprint is the complete trail of data you generate online.' },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Course.deleteMany({});
    await (require('./models/Quiz').Quiz).deleteMany({});
    await (require('./models/Exam').Exam).deleteMany({});
    console.log('🗑  Cleared courses, quizzes, exams');

    const insertedCourses = await Course.insertMany(courses);
    console.log(`✅ Inserted ${insertedCourses.length} courses`);

    // Quizzes
    for (const qd of quizData) {
      const course = insertedCourses.find(c => c.title === qd.courseKey);
      if (!course) continue;
      const quizzesToInsert = qd.quizzes.map(q => ({ ...q, course: course._id }));
      await (require('./models/Quiz').Quiz).insertMany(quizzesToInsert);
    }
    console.log('✅ Inserted quizzes');

    // Exams
    for (const ed of examData) {
      const course = insertedCourses.find(c => c.title === ed.courseKey);
      if (!course) continue;
      await (require('./models/Exam').Exam).create({ ...ed, course: course._id });
    }
    console.log('✅ Inserted exams');

    // Admin account
    const existingAdmin = await User.findOne({ email: 'demo@civicmind.com' });
    if (existingAdmin) {
      existingAdmin.role = 'admin';
      existingAdmin.name = 'Ezra Kimanthi';
      existingAdmin.password = '12345678';
      existingAdmin.xp = 9999;
      existingAdmin.streak = 30;
      existingAdmin.badges = ['👑 Admin', '🎓 Project Manager', '🛡️ Safety Pro'];
      await existingAdmin.save();
      console.log('✅ Admin updated → demo@civicmind.com / 12345678');
    } else {
      const admin = new User({
        name: 'Ezra Kimanthi',
        email: 'demo@civicmind.com',
        password: '12345678',
        role: 'admin',
        xp: 9999,
        streak: 30,
        badges: ['👑 Admin', '🎓 Project Manager', '🛡️ Safety Pro'],
      });
      await admin.save();
      console.log('✅ Admin created → demo@civicmind.com / 12345678');
    }

    console.log('\n🎉 Seed complete!');
    console.log('   Admin → demo@civicmind.com / 12345678');
    console.log('   Students self-register at /register');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
