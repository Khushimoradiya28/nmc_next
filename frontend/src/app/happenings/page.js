'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
    motion
} from 'framer-motion';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import ActivityHero from '@/components/activities/ActivityHero/ActivityHero';
import styles from './page.module.css';

// â”€â”€ Animation Variants â”€â”€
const fadeUp = {
    hidden: {
        opacity: 0,
        y: 30
    },
    visible: {
        opacity: 1,
        y: 0
    }
};
const fadeLeft = {
    hidden: {
        opacity: 0,
        x: -25
    },
    visible: {
        opacity: 1,
        x: 0
    }
};
const stagger = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08
        }
    }
};
const scaleIn = {
    hidden: {
        opacity: 0,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        scale: 1
    }
};

// â”€â”€ Data â”€â”€
const highlights = [{
        date: 'Jul 15',
        tag: 'Scholarship',
        tagColor: 'gold',
        title: 'Alumni Association Declares Scholarship Funds',
        img: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=200&q=75'
    },
    {
        date: 'May 20',
        tag: 'Lecture',
        tagColor: 'red',
        title: 'Expert Session on National Income by Dr. Shah',
        img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200&q=75'
    },
    {
        date: 'Apr 8',
        tag: 'Seminar',
        tagColor: 'red',
        title: 'Guest Lecture on Tax Planning & Clubbing of Income',
        img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&q=75'
    },
    {
        date: 'Mar 15',
        tag: 'MoU',
        tagColor: 'gold',
        title: 'Partnership with TCS for Placement Drives',
        img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&q=75'
    },
    {
        date: 'Feb 5',
        tag: 'NSS',
        tagColor: 'red',
        title: 'Blood Donation Camp & Health Awareness Drive',
        img: 'https://images.unsplash.com/photo-1615461066159-fea0960485d5?w=200&q=75'
    },
];

const newsCards = [{
        date: 'Aug 12',
        tag: 'Sports',
        title: 'NMC Students Win Zonal Youth Festival Championships',
        desc: 'Students brought glory by winning multiple events at the Zonal Youth Festival organized by MKBU.',
        img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&q=80'
    },
    {
        date: 'Jul 28',
        tag: 'Conference',
        title: 'Research Cell Hosts National Commerce Conference',
        desc: 'National-level conference on emerging trends in commerce and management studies.',
        img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80'
    },
    {
        date: 'Jun 22',
        tag: 'Workshop',
        title: 'Ad-Mad Competition & Digital Marketing Workshop',
        desc: 'Shine Club (BBA) organized a creative Ad-Mad competition with industry expert as judge.',
        img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&q=80'
    },
    {
        date: 'Jun 10',
        tag: 'Research',
        title: 'Faculty Paper Published in UGC-CARE Listed Journal',
        desc: 'Research on vocational education and NEP 2020 by NMC faculty accepted in IJIRT journal.',
        img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&q=80'
    },
    {
        date: 'Jan 26',
        tag: 'NCC',
        title: 'Republic Day Celebration & NCC Parade at Campus',
        desc: 'NCC cadets led the parade followed by cultural programs and flag hoisting ceremony.',
        img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&q=80'
    },
];

const events = [{
        date: 'Aug 20, 2026',
        tag: 'Academic',
        title: 'Orientation Day 2026 â€” Welcoming New Students',
        desc: 'Welcoming newly admitted students to their academic tracks with campus tour and introduction sessions.',
        img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&q=80'
    },
    {
        date: 'Dec 18, 2026',
        tag: 'Sports',
        title: 'Annual Sports Meet â€” Indoor & Outdoor Championships',
        desc: 'A week-long indoor and outdoor athletics championship event with inter-department competitions.',
        img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&q=80'
    },
    {
        date: 'Jan 12, 2027',
        tag: 'Seminar',
        title: 'National Seminar on Women Empowerment',
        desc: 'Key lectures by academic researchers and prominent social leaders on women empowerment through education.',
        img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&q=80'
    },
    {
        date: 'Feb 14, 2027',
        tag: 'Cultural',
        title: 'Annual Cultural Festival â€” Talent Showcase',
        desc: 'Dance, drama, music, art exhibitions, and fashion show celebrating student creativity and diversity.',
        img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80'
    },
    {
        date: 'Mar 5,  2027',
        tag: 'Placement',
        title: 'Campus Placement Drive â€” TCS & Partner Companies',
        desc: 'On-campus recruitment drive with leading companies offering job opportunities to final year students.',
        img: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=500&q=80'
    },
    {
        date: 'Mar 20, 2027',
        tag: 'NSS',
        title: 'NSS 7-Day Special Camp â€” Rural Development',
        desc: 'Community service camp in adopted village â€” health awareness, cleanliness drive, and tree plantation.',
        img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&q=80'
    },
];

const notices = [{
        date: 'Aug 18, 2026',
        title: 'Circular 2026/04: Odd Semester Enrollment Verification Dates',
        tag: 'Enrollment'
    },
    {
        date: 'Aug 15, 2026',
        title: 'Anti-Ragging Squad Campus Monitoring Guidelines',
        tag: 'Guidelines'
    },
    {
        date: 'Aug 10, 2026',
        title: 'Syllabus Revision Updates for M.Com Sem-I & II',
        tag: 'Academic'
    },
    {
        date: 'Jul 28, 2026',
        title: 'Scholarship Application Last Date Extended â€” Digital Gujarat',
        tag: 'Scholarship'
    },
    {
        date: 'Jul 20, 2026',
        title: 'Internal Exam Schedule â€” BCA, BBA, B.Com (July 2026)',
        tag: 'Exam'
    },
    {
        date: 'Jul 12, 2026',
        title: 'Fee Payment Deadline Notice for Even Semester Students',
        tag: 'Fee'
    },
];

const mous = [{
        partner: 'Tata Consultancy Services (TCS)',
        area: 'Technical Training & Campus Placement Drives for BCA and BBA students.'
    },
    {
        partner: 'MKBU Commerce Research Cell',
        area: 'Joint Seminars, Academic Publications & Faculty Research Collaboration.'
    },
    {
        partner: 'Regional Vocational Training Center',
        area: 'Apparel Designing, Craft Workshops & Skill Development Programs.'
    },
    {
        partner: 'Gujarat Entrepreneurship Council',
        area: 'Startup Mentoring, Business Plan Competitions & Entrepreneurship Cell Support.'
    },
    {
        partner: 'National Digital Library (NDLI)',
        area: 'Digital Resource Access, E-Learning Integration & Online Research Support.'
    },
    {
        partner: 'SWAYAM & NPTEL',
        area: 'Online Course Credits, MOOC Integration & Faculty Training Programs.'
    },
];

const tagColors = {
    gold: styles.tagGold,
    red: styles.tagRed,
    green: styles.tagGreen
};


