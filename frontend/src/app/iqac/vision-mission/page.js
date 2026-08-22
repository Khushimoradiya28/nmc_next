'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    motion
} from 'framer-motion';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import styles from './VisionMission.module.css';

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 30
    },
    visible: {
        opacity: 1,
        y: 0
    },
};

export default function VisionMissionPage() {
    return ( <
        >
        <
        Header / >
        <
        main className = {
            styles.page
        } >

        {
            /* Hero Banner */ } <
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
        Image src = "/assets/home/hero/2.jpg"
        alt = "Vision & Mission Banner"
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
        div className = "hero-overlay" > < /div> <
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
        Vision & amp; < em > Mission < /em> <
        /h1> <
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
        } > Vision & amp; Mission < /li> <
        /ol> <
        /nav> <
        /div> <
        /section>

        {
            /* Cards Section */ } <
        section className = {
            styles.wrapper
        } >
        <
        div className = {
            styles.grid
        } >

        {
            /* ── VISION CARD ── */ } <
        motion.div className = {
            styles.card
        }
        variants = {
            cardVariants
        }
        initial = "hidden"
        whileInView = "visible"
        viewport = {
            {
                once: true
            }
        }
        transition = {
            {
                duration: 0.6,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1]
            }
        }
        whileHover = {
            {
                y: -6,
                transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                }
            }
        } >
        {
            /* Header: Icon + Label/Title */ } <
        div className = {
            styles.cardHeader
        } >
        <
        div className = {
            `${styles.iconWrapper} ${styles.iconGold}`
        } >
        <
        svg width = "22"
        height = "22"
        viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor"
        strokeWidth = "2"
        strokeLinecap = "round"
        strokeLinejoin = "round" >
        <
        circle cx = "12"
        cy = "12"
        r = "3" / >
        <
        path d = "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" / >
        <
        /svg> <
        /div> <
        div className = {
            styles.cardHeaderText
        } >
        <
        span className = {
            `${styles.cardLabel} ${styles.labelGold}`
        } > 01 / Objective < /span> <
        h3 className = {
            styles.cardTitle
        } > Our Vision < /h3> <
        /div> <
        /div>

        {
            /* Description */ } <
        p className = {
            styles.cardDesc
        } >
        To foster an institutional culture driven by pedagogical excellence, research integration,
        and holistic student development— empowering learners
        for global contribution. <
        /p>

        {
            /* Divider */ } <
        div className = {
            `${styles.divider} ${styles.dividerGold}`
        } > < /div>

        {
            /* Sub-section */ } <
        p className = {
            styles.subLabel
        } > Core Pillars < /p> <
        ul className = {
            styles.checklist
        } >
        <
        li className = {
            styles.checkItem
        } >
        <
        span className = {
            `${styles.checkIcon} ${styles.checkIconGold}`
        } >
        <
        svg width = "12"
        height = "12"
        viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor"
        strokeWidth = "3"
        strokeLinecap = "round"
        strokeLinejoin = "round" >
        <
        polyline points = "20 6 9 17 4 12" / >
        <
        /svg> <
        /span> <
        span className = {
            styles.checkText
        } > < strong > Pedagogical Excellence: < /strong> Promoting innovative and student-centric learning methods.</span >
        <
        /li> <
        li className = {
            styles.checkItem
        } >
        <
        span className = {
            `${styles.checkIcon} ${styles.checkIconGold}`
        } >
        <
        svg width = "12"
        height = "12"
        viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor"
        strokeWidth = "3"
        strokeLinecap = "round"
        strokeLinejoin = "round" >
        <
        polyline points = "20 6 9 17 4 12" / >
        <
        /svg> <
        /span> <
        span className = {
            styles.checkText
        } > < strong > Research Integration: < /strong> Infusing academic curriculum with active inquiry and discovery.</span >
        <
        /li> <
        li className = {
            styles.checkItem
        } >
        <
        span className = {
            `${styles.checkIcon} ${styles.checkIconGold}`
        } >
        <
        svg width = "12"
        height = "12"
        viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor"
        strokeWidth = "3"
        strokeLinecap = "round"
        strokeLinejoin = "round" >
        <
        polyline points = "20 6 9 17 4 12" / >
        <
        /svg> <
        /span> <
        span className = {
            styles.checkText
        } > < strong > Holistic Development: < /strong> Focusing on life-skills, values, and character development.</span >
        <
        /li> <
        /ul> <
        /motion.div>

        {
            /* ── MISSION CARD ── */ } <
        motion.div className = {
            styles.card
        }
        variants = {
            cardVariants
        }
        initial = "hidden"
        whileInView = "visible"
        viewport = {
            {
                once: true
            }
        }
        transition = {
            {
                duration: 0.6,
                delay: 0.25,
                ease: [0.16, 1, 0.3, 1]
            }
        }
        whileHover = {
            {
                y: -6,
                transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                }
            }
        } >
        {
            /* Header: Icon + Label/Title */ } <
        div className = {
            styles.cardHeader
        } >
        <
        div className = {
            `${styles.iconWrapper} ${styles.iconRed}`
        } >
        <
        svg width = "22"
        height = "22"
        viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor"
        strokeWidth = "2"
        strokeLinecap = "round"
        strokeLinejoin = "round" >
        <
        circle cx = "12"
        cy = "12"
        r = "10" / >
        <
        circle cx = "12"
        cy = "12"
        r = "6" / >
        <
        circle cx = "12"
        cy = "12"
        r = "2" / >
        <
        /svg> <
        /div> <
        div className = {
            styles.cardHeaderText
        } >
        <
        span className = {
            `${styles.cardLabel} ${styles.labelRed}`
        } > 02 / Action Plan < /span> <
        h3 className = {
            styles.cardTitle
        } > Our Mission < /h3> <
        /div> <
        /div>

        {
            /* Description */ } <
        p className = {
            styles.cardDesc
        } >
        To develop systems
        for continuous academic and administrative enhancement through student - centric learning, faculty training, and structured feedback mechanisms. <
        /p>

        {
            /* Divider */ } <
        div className = {
            `${styles.divider} ${styles.dividerRed}`
        } > < /div>

        {
            /* Sub-section */ } <
        p className = {
            styles.subLabel
        } > Key Focus Areas < /p> <
        ul className = {
            styles.checklist
        } >
        <
        li className = {
            styles.checkItem
        } >
        <
        span className = {
            `${styles.checkIcon} ${styles.checkIconRed}`
        } >
        <
        svg width = "12"
        height = "12"
        viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor"
        strokeWidth = "3"
        strokeLinecap = "round"
        strokeLinejoin = "round" >
        <
        polyline points = "20 6 9 17 4 12" / >
        <
        /svg> <
        /span> <
        span className = {
            styles.checkText
        } > < strong > Quality Enhancement: < /strong> Building strong internal checks and balances for administration.</span >
        <
        /li> <
        li className = {
            styles.checkItem
        } >
        <
        span className = {
            `${styles.checkIcon} ${styles.checkIconRed}`
        } >
        <
        svg width = "12"
        height = "12"
        viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor"
        strokeWidth = "3"
        strokeLinecap = "round"
        strokeLinejoin = "round" >
        <
        polyline points = "20 6 9 17 4 12" / >
        <
        /svg> <
        /span> <
        span className = {
            styles.checkText
        } > < strong > Faculty Empowerment: < /strong> Organizing structured training and capacity building programs.</span >
        <
        /li> <
        li className = {
            styles.checkItem
        } >
        <
        span className = {
            `${styles.checkIcon} ${styles.checkIconRed}`
        } >
        <
        svg width = "12"
        height = "12"
        viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor"
        strokeWidth = "3"
        strokeLinecap = "round"
        strokeLinejoin = "round" >
        <
        polyline points = "20 6 9 17 4 12" / >
        <
        /svg> <
        /span> <
        span className = {
            styles.checkText
        } > < strong > Feedback Loop: < /strong> Implementing regular multi-stakeholder evaluations for refinement.</span >
        <
        /li> <
        /ul> <
        /motion.div>

        <
        /div> <
        /section>

        <
        /main> <
        Footer / >
        <
        />
    );
}