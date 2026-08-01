const BASE = import.meta.env.BASE_URL;

export const PROJECTS = [
    {
        id: 1,
        slug: 'baymax-ai',
        image: `${BASE}7.png`,
        gallery: [`${BASE}2.4.jpg`, `${BASE}2.3.jpg`, `${BASE}2.2.png`],
        title: 'Baymax AI',
        role: 'AI Systems · Multimodal Architecture',
        stars: 5,
        description: "A multimodal AI healthcare assistant combining real-time emotion recognition, structured health surveys, predictive ML models, and conversational intelligence powered by a locally deployed LLM. Engineered as a layered inference pipeline for low-latency medical interaction.",
        github: "https://github.com/figurerevitalization/BAYMAX.git",
        tech: ["Python", "OpenCV", "TensorFlow", "Ollama", "FastAPI"],
        features: [
            "Live facial emotion recognition",
            "Heart, diabetes & risk prediction modules",
            "LLM-based contextual medical responses",
            "MP3 voice output generation",
            "Modular AI inference architecture"
        ]
    },
    {
        id: 2,
        slug: 'google-summit',
        image: `${BASE}2.png`,
        gallery: [`${BASE}5.2.jpg`, `${BASE}5.1.png`, `${BASE}5.3.jpg`],
        title: 'GSC Summit',
        role: 'National Innovation · 2nd Place',
        stars: 5,
        description: "Awarded 2nd place at the Google Student Club Summit for presenting an AI-driven healthcare innovation. Recognized for system architecture clarity, real-world applicability, and execution depth during live technical evaluation.",
        github: "",
        tech: ["AI System Design", "Innovation Strategy", "Technical Presentation"],
        features: [
            "2nd Place – National Level",
            "Live demo under jury evaluation",
            "Cross-campus competition",
            "Recognized for architecture depth"
        ]
    },
    {
        id: 3,
        slug: 'karukarjo-erp',
        image: `${BASE}6.png`,
        gallery: [`${BASE}6.2.jpg`, `${BASE}6.1.jpg`, `${BASE}6.3.png`],
        title: 'Karukarjo ERP',
        role: 'ERP Architecture · Automation',
        stars: 5,
        description: "A Google Sheets-based ERP and POS ecosystem designed for real-time inventory control, barcode-based billing, automated stock deduction, and structured sales logging. Built using Apps Script to simulate enterprise-grade workflow automation.",
        googlesheet: "https://script.google.com/macros/s/AKfycbxSe7eYNnGAsuj1AW-zmgfiMFU2hEXShFM0jnfTRYjhf9JqQ01-B26_H-M2P1e3mrI0iA/exec",
        tech: ["Google Apps Script", "JavaScript", "Sheets API"],
        features: [
            "Barcode-driven billing interface",
            "Automated stock deduction logic",
            "PDF invoice generation engine",
            "Multi-sheet workflow automation",
            "Real-time transaction logging"
        ]
    },
    {
        id: 4,
        slug: 'vision-ai',
        image: `${BASE}5.png`,
        gallery: [`${BASE}3.1.jpg`, `${BASE}3.2.jpg`, `${BASE}3.3.jpg`],
        title: 'Vision AI',
        role: 'Computer Vision · Hackathon Build',
        stars: 5,
        description: "A real-time face detection and gender classification system developed for hackathon deployment. Designed for low-latency webcam inference with CNN-based classification and multi-face support.",
        github: "https://github.com/man4mandal/TechnicalChads.git",
        tech: ["Python", "OpenCV", "TensorFlow"],
        features: [
            "Multi-face detection pipeline",
            "CNN-based gender classification",
            "Confidence scoring metrics",
            "Optimized real-time inference"
        ]
    },
    {
        id: 5,
        slug: 'robotics-lab',
        image: `${BASE}1.png`,
        gallery: [`${BASE}10.1.jpg`, `${BASE}10.2.jpg`, `${BASE}10.3.jpg`],
        title: 'Robotics Lab',
        role: 'Embedded Systems · Robotics Engineering',
        stars: 5,
        description: "Hands-on robotics engineering involving motor driver integration, ESC configuration, wireless transmitter-receiver control systems, and embedded architecture design. Delivered a robotics systems conference session at NSEC.",
        linkedin: "https://www.linkedin.com/posts/anirban-roy-a510a02b1_roboticsmentor-nsec-netajisubhashengineeringcollege-ugcPost-7321265244381593621-RCaJ?utm_source=share&utm_medium=member_desktop&rcm=ACoAAErw_90BV53DyYeG5QNr_HpM1UbNl1JjBmY",
        tech: ["Arduino", "Embedded C", "ESC Systems", "RC Control"],
        features: [
            "Remote-controlled robotic platforms",
            "ESC & motor driver integration",
            "Wireless RF control systems",
            "Robotics conference speaker (NSEC)"
        ]
    },
    {
        id: 6,
        slug: 'kali-webos',
        image: `${BASE}3.png`,
        gallery: [`${BASE}9.1.png`, `${BASE}9.2.png`, `${BASE}9.3.png`],
        title: 'Kali WebOS',
        role: 'System Simulation · Cyber UI',
        stars: 4,
        description: "A browser-based operating system simulation inspired by cybersecurity environments. Built with modular architecture, terminal-style interaction, and state-driven UI logic to emulate OS-level abstraction in the browser.",
        github: "https://github.com/figurerevitalization/KAli_Web-OS.git",
        linkedin: "https://www.linkedin.com/posts/anirban-roy-a510a02b1_cybersecurity-webos-kalilinux-ugcPost-7370559042144088064-sXD3?utm_source=share&utm_medium=member_desktop&rcm=ACoAAErw_90BV53DyYeG5QNr_HpM1UbNl1JjBmY",
        tech: ["JavaScript", "Node.js", "Express"],
        features: [
            "Terminal-style command interface",
            "Virtual file system simulation",
            "Modular app loader structure",
            "State-managed UI engine"
        ]
    },
    {
        id: 7,
        slug: 'eco-pod',
        image: `${BASE}4.png`,
        gallery: [`${BASE}4.1.jpg`, `${BASE}4.2.jpg`, `${BASE}4.3.jpg`],
        title: 'ECO Pod',
        role: 'Secure Communication · Embedded Systems',
        stars: 5,
        description: "Encrypted Communication Portable Device (ECo PoD) implementing BB84 Quantum Key Distribution (QKD) with hybrid Li-Fi and ESP32-based wireless communication. Engineered as a portable, low-power secure communication system for mission-critical environments.",
        linkedin: "https://www.linkedin.com/feed/update/urn:li:activity:7372613731232673792/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAErw_90BV53DyYeG5QNr_HpM1UbNl1JjBmY",
        tech: ["ESP32", "Li-Fi", "Quantum Key Distribution", "Embedded C"],
        features: [
            "BB84 QKD-based encryption key generation",
            "Hybrid Li-Fi + Wi-Fi communication",
            "Real-time encryption & decryption",
            "Portable low-power hardware design",
            "Secure multi-node networking"
        ]
    },
    {
        id: 8,
        slug: 'modern-ui-ux',
        image: `${BASE}8.png`,
        gallery: [`${BASE}11.1.jpeg`, `${BASE}11.2.jpeg`, `${BASE}11.3.jpeg`],
        title: 'UI/UX Systems',
        role: 'Product Interface · Design Engineering',
        stars: 5,
        description: "A structured product design framework focused on scalable design systems, interaction logic, and seamless translation from prototype to production-ready front-end architecture. Built to align visual precision with functional system thinking.",
        github: "https://github.com/figurerevitalization/EARTH-UI",
        tech: ["Figma", "Design Systems", "Interaction Design", "Component Architecture"],
        features: [
            "Scalable component-based design system",
            "High-fidelity interactive prototypes",
            "Design-to-code alignment strategy",
            "Accessibility-aware layout systems",
            "Responsive interaction standards"
        ]
    }
];
