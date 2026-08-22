'use client';

import React, {
    useState
} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    motion
} from 'framer-motion';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import IQACAnimations from '../IQACAnimations';
import styles from './page.module.css';

// Structured committee data with high-quality descriptions and roles
const leadership = {
    title: "Chairperson",
    name: "Dr. Vijaysinh Gohil",
    role: "Principal, Nandkunvarba Mahila College",
    photo: "/assets/our-faculties/principal.jpg",
    desc: "Responsible for steering institutional vision, approving major academic initiatives, and ensuring quality assurance systems are properly funded, staffed, and aligned with national accreditation parameters."
};

const coordinator = {
    title: "IQAC Coordinator",
    name: "Prof. H. M. Patel",
    role: "Professor & Academic Head, NMC",
    photo: "/assets/our-faculties/patel.jpg",
    desc: "Leads the operational implementation of quality cycles. Directs academic audits, coordinates regular feedback collection, conducts faculty performance evaluations, and oversees annual AQAR submissions."
};

const management = {
    title: "Management Representative",
    name: "Shri Sahajanand Education Trust",
    role: "Board of Trustees Representative",
    desc: "Provides corporate governance support, ensuring the alignment of institutional expansions, resource allocations, and financial investments with NAAC/NIRF standards."
};

const facultyMembers = [{
        name: "Prof. K. R. Mehta",
        role: "Senior Faculty, Arts Department",
        desc: "Oversees humanities curriculum enrichment, integrates community outreach into student coursework, monitored support systems."
    },
    {
        name: "Dr. S. D. Vyas",
        role: "Senior Faculty, Commerce Department",
        desc: "Directs professional accounting programs, guides entrepreneurial cells, and evaluates course outcome mapping matrices."
    },
    {
        name: "Prof. R. T. Mori",
        role: "Senior Faculty, Computer Application (BCA)",
        desc: "Leads digital education modules, monitors campus ICT infrastructure, and manages student records automation projects."
    },
    {
        name: "Prof. S. R. Jadeja",
        role: "Senior Faculty, Business Administration (BBA)",
        desc: "Directs campus placement drives, coordinates industrial visits, and runs leadership workshops for student empowerment."
    }
];

const externalMembers = [{
        name: "Industry Expert Representative",
        role: "Local Industry Mentor",
        desc: "Helps bridge the gap between academic education and industry requirements by suggesting skill development programs."
    },
    {
        name: "Alumni Association President",
        role: "External Graduate Representative",
        desc: "Represents alumni feedback, shares job opportunities, and helps organize alumni networking events."
    },
    {
        name: "Administrative Office Superintendent",
        role: "Office Administration Head",
        desc: "Manages administrative data collection, oversees student admission processes, and ensures smooth record-keeping."
    },
    {
        name: "Student Council General Secretary",
        role: "Student Union Representative",
        desc: "Represents the student body, shares student feedback on facilities, and coordinates student-led quality initiatives."
    }
];

export default function CompositionOfIQAC() {
    const [expandedFaculty, setExpandedFaculty] = useState({});
    const [expandedExternal, setExpandedExternal] = useState({});

    const toggleFaculty = (index) => {
        setExpandedFaculty(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const toggleExternal = (index) => {
        setExpandedExternal(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };
    return ( <
        >
        <
        Header / >
        <
        main className = {
            styles.page
        } >

        {
            /* Fullscreen style Hero Banner using global theme classes */ } <
        section className = "hero-fullscreen"
        id = "home"
        style = {
            {
                minHeight: "50vh",
                height: "50vh"
            }
        } >
        <
        div className = "hero-bg-image" >
        <
        Image src = "/assets/banners/vision_mission_banner.jpg"
        alt = "Composition of IQAC Banner"
        fill style = {
            {
                objectFit: 'cover'
            }
        }
        className = "hero-bg-img"
        priority /
        >
        <
        /div> <
        div className = "hero-overlay" > < /div>

        <
        div className = "hero-content container"
        style = {
            {
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                height: "100%",
                paddingBottom: "80px"
            }
        } >
        <
        h1 className = "hero-main-title" >
        Composition of < em > IQAC < /em> <
        /h1>

        {
            /* Breadcrumb inside Hero Banner */ } <
        nav aria - label = "breadcrumb" >
        <
        ol style = {
            {
                display: "flex",
                listStyle: "none",
                padding: 0,
                margin: 0,
                gap: "0.5rem",
                color: "var(--gold-500, #f59e0b)",
                fontSize: "0.85rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px"
            }
        } >
        <
        li > < Link href = "/"
        style = {
            {
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none"
            }
        } > Home < /Link></li >
        <
        li style = {
            {
                color: "rgba(255,255,255,0.5)"
            }
        } > & gt; < /li> <
        li > < Link href = "/iqac"
        style = {
            {
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none"
            }
        } > IQAC < /Link></li >
        <
        li style = {
            {
                color: "rgba(255,255,255,0.5)"
            }
        } > & gt; < /li> <
        li aria - current = "page"
        style = {
            {
                color: "var(--gold-500, #f59e0b)"
            }
        } > Composition < /li> <
        /ol> <
        /nav> <
        /div> <
        /section>

        {
            /* Content Body wrapped in GSAP animation module */ } <
        IQACAnimations >
        <
        div className = {
            styles.container
        } >
        <
        div className = {
            styles.sectionHeader
        }
        data - animate = "header" >
        <
        span className = {
            styles.topBadge
        } > Executive Members < /span> <
        p className = {
            styles.sectionDesc
        } >
        The administrative and academic monitoring council ensuring quality benchmarking, audits, and academic enhancements at Nandkunvarba Mahila College. <
        /p> <
        /div>

        {
            /* Leaders Section */ } <
        div className = {
            styles.leadersRow
        } > {
            /* Principal */ } <
        motion.div className = {
            styles.leaderCard
        }
        whileHover = {
            {
                y: -6,
                scale: 1.01
            }
        }
        transition = {
            {
                type: "tween",
                ease: "easeOut",
                duration: 0.4
            }
        } >
        <
        div className = {
            styles.bgTextWatermark
        } > NMC < /div> <
        div className = {
            styles.cardHeader
        } >
        <
        span className = {
            styles.roleTagRed
        } > {
            leadership.title
        } < /span> <
        h3 className = {
            styles.leaderName
        } > {
            leadership.name
        } < /h3> <
        p className = {
            styles.leaderRole
        } > {
            leadership.role
        } < /p> <
        /div> <
        div className = {
            styles.cardBody
        } >
        <
        p className = {
            styles.leaderDesc
        } > {
            leadership.desc
        } < /p> <
        /div> <
        /motion.div>

        {
            /* Coordinator */ } <
        motion.div className = {
            styles.leaderCard
        }
        whileHover = {
            {
                y: -6,
                scale: 1.01
            }
        }
        transition = {
            {
                type: "tween",
                ease: "easeOut",
                duration: 0.4
            }
        } >
        <
        div className = {
            styles.bgTextWatermark
        } > NMC < /div> <
        div className = {
            styles.cardHeader
        } >
        <
        span className = {
            styles.roleTagGold
        } > {
            coordinator.title
        } < /span> <
        h3 className = {
            styles.leaderName
        } > {
            coordinator.name
        } < /h3> <
        p className = {
            styles.leaderRole
        } > {
            coordinator.role
        } < /p> <
        /div> <
        div className = {
            styles.cardBody
        } >
        <
        p className = {
            styles.leaderDesc
        } > {
            coordinator.desc
        } < /p> <
        /div> <
        /motion.div> <
        /div>

        {
            /* Board Grid wrapper with IQAC watermark decoration */ } <
        div style = {
            {
                position: 'relative',
                marginTop: '4rem'
            }
        } >
        <
        div className = {
            styles.boardGrid
        } >

        {
            /* Management Block */ } <
        div className = {
            styles.boardCard
        } >
        <
        div className = {
            styles.bgTextWatermarkRight
        } > IQAC < /div> <
        h4 className = {
            styles.boardCardHeading
        } > Management & amp; Trustee < /h4> <
        p className = {
            styles.boardMemberName
        } > {
            management.name
        } < /p> <
        p className = {
            styles.boardMemberRole
        } > {
            management.role
        } < /p> <
        p className = {
            styles.boardMemberDesc
        } > {
            management.desc
        } < /p> <
        /div>

        {
            /* Faculty Members */ } <
        div className = {
            styles.boardCard
        } >
        <
        div className = {
            styles.bgTextWatermarkRight
        } > IQAC < /div> <
        h4 className = {
            styles.boardCardHeading
        } > Senior Faculty Representatives < /h4> <
        div className = {
            styles.memberList
        } > {
            facultyMembers.map((m, i) => {
                const isExpanded = expandedFaculty[i];
                const shortDesc = m.desc.length > 75 ? `${m.desc.slice(0, 72)}...` : m.desc;
                return ( <
                    div key = {
                        i
                    }
                    className = {
                        styles.listItem
                    } >
                    <
                    div className = {
                        styles.bulletRed
                    }
                    /> <
                    div >
                    <
                    p className = {
                        styles.listMemberName
                    } > {
                        m.name
                    } < /p> <
                    p className = {
                        styles.listMemberRole
                    } > {
                        m.role
                    } < /p> <
                    p className = {
                        styles.listMemberDesc
                    } > {
                        isExpanded ? m.desc : shortDesc
                    } {
                        m.desc.length > 75 && ( <
                            button onClick = {
                                () => toggleFaculty(i)
                            }
                            className = {
                                styles.readMoreBtn
                            } >
                            {
                                isExpanded ? ' Read Less' : ' Read More'
                            } <
                            /button>
                        )
                    } <
                    /p> <
                    /div> <
                    /div>
                );
            })
        } <
        /div> <
        /div>

        {
            /* External Representatives */ } <
        div className = {
            styles.boardCard
        } >
        <
        div className = {
            styles.bgTextWatermarkRight
        } > IQAC < /div> <
        h4 className = {
            styles.boardCardHeading
        } > External & amp; Outreach Members < /h4> <
        div className = {
            styles.memberList
        } > {
            externalMembers.map((m, i) => {
                const isExpanded = expandedExternal[i];
                const shortDesc = m.desc.length > 75 ? `${m.desc.slice(0, 72)}...` : m.desc;
                return ( <
                    div key = {
                        i
                    }
                    className = {
                        styles.listItem
                    } >
                    <
                    div className = {
                        styles.bulletGold
                    }
                    /> <
                    div >
                    <
                    p className = {
                        styles.listMemberName
                    } > {
                        m.name
                    } < /p> <
                    p className = {
                        styles.listMemberRole
                    } > {
                        m.role
                    } < /p> <
                    p className = {
                        styles.listMemberDesc
                    } > {
                        isExpanded ? m.desc : shortDesc
                    } {
                        m.desc.length > 75 && ( <
                            button onClick = {
                                () => toggleExternal(i)
                            }
                            className = {
                                styles.readMoreBtn
                            } >
                            {
                                isExpanded ? ' Read Less' : ' Read More'
                            } <
                            /button>
                        )
                    } <
                    /p> <
                    /div> <
                    /div>
                );
            })
        } <
        /div> <
        /div>

        <
        /div> <
        /div> <
        /div> <
        /IQACAnimations>

        <
        /main> <
        Footer / >
        <
        />
    );
}