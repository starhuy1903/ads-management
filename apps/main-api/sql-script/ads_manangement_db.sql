--
-- PostgreSQL database dump
--

-- Dumped from database version 15.5
-- Dumped by pg_dump version 16.0

-- Started on 2024-01-14 16:29:03 +07

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 163840)
-- Name: public; Type: SCHEMA; Schema: -; Owner: admin
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO "admin";

--
-- TOC entry 2687 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: admin
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 861 (class 1247 OID 163850)
-- Name: AdsRequestType; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."AdsRequestType" AS ENUM (
    'UPDATE_DATA',
    'APPROVED_PANEL'
);


ALTER TYPE public."AdsRequestType" OWNER TO "admin";

--
-- TOC entry 864 (class 1247 OID 163864)
-- Name: LocationStatus; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."LocationStatus" AS ENUM (
    'APPROVED',
    'AWAITING_UPDATE'
);


ALTER TYPE public."LocationStatus" OWNER TO "admin";

--
-- TOC entry 858 (class 1247 OID 163842)
-- Name: PanelStatus; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."PanelStatus" AS ENUM (
    'DRAFT',
    'APPROVED',
    'AWAITING_UPDATE'
);


ALTER TYPE public."PanelStatus" OWNER TO "admin";

--
-- TOC entry 900 (class 1247 OID 172045)
-- Name: UserRole; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."UserRole" AS ENUM (
    'ward_officer',
    'district_officer',
    'cdo'
);


ALTER TYPE public."UserRole" OWNER TO "admin";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 229 (class 1259 OID 163938)
-- Name: ads_request; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.ads_request (
    id integer NOT NULL,
    reason text NOT NULL,
    status character varying(255) NOT NULL,
    target_type character varying(255) NOT NULL,
    user_id integer NOT NULL,
    location_id integer,
    panel_id integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    type public."AdsRequestType" DEFAULT 'UPDATE_DATA'::public."AdsRequestType" NOT NULL
);


ALTER TABLE public.ads_request OWNER TO "admin";

--
-- TOC entry 228 (class 1259 OID 163937)
-- Name: ads_request_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.ads_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ads_request_id_seq OWNER TO "admin";

--
-- TOC entry 2689 (class 0 OID 0)
-- Dependencies: 228
-- Name: ads_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.ads_request_id_seq OWNED BY public.ads_request.id;


--
-- TOC entry 223 (class 1259 OID 163911)
-- Name: advertisement_type; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.advertisement_type (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.advertisement_type OWNER TO "admin";

--
-- TOC entry 222 (class 1259 OID 163910)
-- Name: advertisement_type_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.advertisement_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.advertisement_type_id_seq OWNER TO "admin";

--
-- TOC entry 2690 (class 0 OID 0)
-- Dependencies: 222
-- Name: advertisement_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.advertisement_type_id_seq OWNED BY public.advertisement_type.id;


--
-- TOC entry 225 (class 1259 OID 163920)
-- Name: district; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.district (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.district OWNER TO "admin";

--
-- TOC entry 224 (class 1259 OID 163919)
-- Name: district_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.district_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.district_id_seq OWNER TO "admin";

--
-- TOC entry 2691 (class 0 OID 0)
-- Dependencies: 224
-- Name: district_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.district_id_seq OWNED BY public.district.id;


--
-- TOC entry 219 (class 1259 OID 163890)
-- Name: location; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.location (
    id integer NOT NULL,
    lat numeric(65,30) NOT NULL,
    long numeric(65,30) NOT NULL,
    is_planning boolean DEFAULT false NOT NULL,
    district_id integer NOT NULL,
    ward_id integer NOT NULL,
    full_address text NOT NULL,
    type_id integer NOT NULL,
    ad_type_id integer NOT NULL,
    image_urls text[],
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    name text,
    belong_location_id integer,
    status public."LocationStatus" DEFAULT 'APPROVED'::public."LocationStatus" NOT NULL
);


ALTER TABLE public.location OWNER TO "admin";

--
-- TOC entry 218 (class 1259 OID 163889)
-- Name: location_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.location_id_seq OWNER TO "admin";

--
-- TOC entry 2692 (class 0 OID 0)
-- Dependencies: 218
-- Name: location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.location_id_seq OWNED BY public.location.id;


--
-- TOC entry 221 (class 1259 OID 163902)
-- Name: location_type; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.location_type (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.location_type OWNER TO "admin";

--
-- TOC entry 220 (class 1259 OID 163901)
-- Name: location_type_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.location_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.location_type_id_seq OWNER TO "admin";

--
-- TOC entry 2693 (class 0 OID 0)
-- Dependencies: 220
-- Name: location_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.location_type_id_seq OWNED BY public.location_type.id;


--
-- TOC entry 215 (class 1259 OID 163870)
-- Name: panel; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.panel (
    id integer NOT NULL,
    type_id integer NOT NULL,
    width numeric(65,30) NOT NULL,
    height numeric(65,30) NOT NULL,
    location_id integer NOT NULL,
    image_urls text[],
    create_contract_date timestamp(3) without time zone NOT NULL,
    expired_contract_date timestamp(3) without time zone NOT NULL,
    company_email text NOT NULL,
    company_number text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    status public."PanelStatus" DEFAULT 'DRAFT'::public."PanelStatus" NOT NULL,
    belong_panel_id integer
);


ALTER TABLE public.panel OWNER TO "admin";

--
-- TOC entry 214 (class 1259 OID 163869)
-- Name: panel_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.panel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.panel_id_seq OWNER TO "admin";

--
-- TOC entry 2694 (class 0 OID 0)
-- Dependencies: 214
-- Name: panel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.panel_id_seq OWNED BY public.panel.id;


--
-- TOC entry 217 (class 1259 OID 163881)
-- Name: panel_type; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.panel_type (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.panel_type OWNER TO "admin";

--
-- TOC entry 216 (class 1259 OID 163880)
-- Name: panel_type_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.panel_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.panel_type_id_seq OWNER TO "admin";

--
-- TOC entry 2695 (class 0 OID 0)
-- Dependencies: 216
-- Name: panel_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.panel_type_id_seq OWNED BY public.panel_type.id;


--
-- TOC entry 231 (class 1259 OID 163949)
-- Name: report; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.report (
    id integer NOT NULL,
    type_id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    content text NOT NULL,
    image_urls character varying(255)[],
    target_type character varying(255) NOT NULL,
    location_id integer,
    panel_id integer,
    status character varying(255) NOT NULL,
    resolved_content text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    user_uuid character varying(255) NOT NULL,
    lat numeric(65,30),
    long numeric(65,30),
    district_id integer,
    ward_id integer
);


ALTER TABLE public.report OWNER TO "admin";

--
-- TOC entry 230 (class 1259 OID 163948)
-- Name: report_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.report_id_seq OWNER TO "admin";

--
-- TOC entry 2696 (class 0 OID 0)
-- Dependencies: 230
-- Name: report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.report_id_seq OWNED BY public.report.id;


--
-- TOC entry 233 (class 1259 OID 163959)
-- Name: report_type; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.report_type (
    id integer NOT NULL,
    name character varying(255)
);


ALTER TABLE public.report_type OWNER TO "admin";

--
-- TOC entry 232 (class 1259 OID 163958)
-- Name: report_type_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.report_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.report_type_id_seq OWNER TO "admin";

--
-- TOC entry 2697 (class 0 OID 0)
-- Dependencies: 232
-- Name: report_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.report_type_id_seq OWNED BY public.report_type.id;


--
-- TOC entry 235 (class 1259 OID 163966)
-- Name: user; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone_number text,
    dob timestamp(3) without time zone,
    reset_password boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ward_id integer,
    district_id integer,
    role public."UserRole" DEFAULT 'ward_officer'::public."UserRole" NOT NULL,
    refresh_token text
);


ALTER TABLE public."user" OWNER TO "admin";

--
-- TOC entry 234 (class 1259 OID 163965)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO "admin";

--
-- TOC entry 2698 (class 0 OID 0)
-- Dependencies: 234
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 227 (class 1259 OID 163929)
-- Name: ward; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.ward (
    id integer NOT NULL,
    name text NOT NULL,
    district_id integer NOT NULL
);


ALTER TABLE public.ward OWNER TO "admin";

--
-- TOC entry 226 (class 1259 OID 163928)
-- Name: ward_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.ward_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ward_id_seq OWNER TO "admin";

--
-- TOC entry 2699 (class 0 OID 0)
-- Dependencies: 226
-- Name: ward_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.ward_id_seq OWNED BY public.ward.id;


--
-- TOC entry 2465 (class 2604 OID 163941)
-- Name: ads_request id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ads_request ALTER COLUMN id SET DEFAULT nextval('public.ads_request_id_seq'::regclass);


--
-- TOC entry 2462 (class 2604 OID 163914)
-- Name: advertisement_type id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.advertisement_type ALTER COLUMN id SET DEFAULT nextval('public.advertisement_type_id_seq'::regclass);


--
-- TOC entry 2463 (class 2604 OID 163923)
-- Name: district id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.district ALTER COLUMN id SET DEFAULT nextval('public.district_id_seq'::regclass);


--
-- TOC entry 2457 (class 2604 OID 163893)
-- Name: location id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.location ALTER COLUMN id SET DEFAULT nextval('public.location_id_seq'::regclass);


--
-- TOC entry 2461 (class 2604 OID 163905)
-- Name: location_type id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.location_type ALTER COLUMN id SET DEFAULT nextval('public.location_type_id_seq'::regclass);


--
-- TOC entry 2453 (class 2604 OID 163873)
-- Name: panel id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.panel ALTER COLUMN id SET DEFAULT nextval('public.panel_id_seq'::regclass);


--
-- TOC entry 2456 (class 2604 OID 163884)
-- Name: panel_type id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.panel_type ALTER COLUMN id SET DEFAULT nextval('public.panel_type_id_seq'::regclass);


--
-- TOC entry 2468 (class 2604 OID 163952)
-- Name: report id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report ALTER COLUMN id SET DEFAULT nextval('public.report_id_seq'::regclass);


--
-- TOC entry 2470 (class 2604 OID 163962)
-- Name: report_type id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report_type ALTER COLUMN id SET DEFAULT nextval('public.report_type_id_seq'::regclass);


--
-- TOC entry 2471 (class 2604 OID 163969)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 2464 (class 2604 OID 163932)
-- Name: ward id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ward ALTER COLUMN id SET DEFAULT nextval('public.ward_id_seq'::regclass);


--
-- TOC entry 2675 (class 0 OID 163938)
-- Dependencies: 229
-- Data for Name: ads_request; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.ads_request (id, reason, status, target_type, user_id, location_id, panel_id, created_at, updated_at, type) FROM stdin;
40	Update size of panel	PENDING	Panel	14	\N	40	2024-01-11 15:19:19.534	2024-01-11 15:19:19.534	UPDATE_DATA
41	Bảo vệ môi trường	PENDING	Panel	16	\N	37	2024-01-11 15:20:56.162	2024-01-11 15:20:56.162	APPROVED_PANEL
37	Please approve this	CANCELED	Panel	16	\N	37	2024-01-11 14:51:36.631	2024-01-11 15:23:06.021	APPROVED_PANEL
42	Update image	PENDING	Panel	16	\N	41	2024-01-11 15:23:52.188	2024-01-11 15:23:52.188	UPDATE_DATA
6	This is a sample ads-request reason.	CANCELED	Panel	2	\N	1	2023-12-30 14:24:18.998	2023-12-30 16:19:51.651	APPROVED_PANEL
2	This is a sample ads-request reason.	PENDING	Panel	2	\N	1	2023-12-30 14:24:11.83	2023-12-30 14:24:11.83	APPROVED_PANEL
3	This is a sample ads-request reason.	PENDING	Panel	2	\N	1	2023-12-30 14:24:16.182	2023-12-30 14:24:16.182	APPROVED_PANEL
4	This is a sample ads-request reason.	PENDING	Panel	2	\N	1	2023-12-30 14:24:17.247	2023-12-30 14:24:17.247	APPROVED_PANEL
5	This is a sample ads-request reason.	PENDING	Panel	2	\N	1	2023-12-30 14:24:18.212	2023-12-30 14:24:18.212	APPROVED_PANEL
7	This is a sample ads-request reason.	PENDING	Panel	2	\N	1	2023-12-30 14:24:19.757	2023-12-30 14:24:19.757	APPROVED_PANEL
43	Update image	PENDING	Location	15	27	\N	2024-01-11 15:38:43.137	2024-01-11 15:38:43.137	UPDATE_DATA
44	Update image	PENDING	Location	17	28	\N	2024-01-11 15:58:06.156	2024-01-11 15:58:06.156	UPDATE_DATA
45	This is a sample ads-request reason.	PENDING	Panel	2	\N	2	2024-01-13 13:16:49.711	2024-01-13 13:16:49.711	APPROVED_PANEL
16	Update location image	PENDING	Location	11	17	\N	2024-01-04 08:21:00.341	2024-01-04 08:21:00.341	UPDATE_DATA
17	Update location image	PENDING	Location	11	18	\N	2024-01-04 09:19:13.128	2024-01-04 09:19:13.128	UPDATE_DATA
18	abc	PENDING	Panel	2	\N	16	2024-01-04 09:35:08.079	2024-01-04 09:35:08.079	UPDATE_DATA
19	Update panel image	PENDING	Panel	11	\N	17	2024-01-04 14:44:35.146	2024-01-04 14:44:35.146	UPDATE_DATA
20	This is a sample ads-request reason.	CANCELED	Panel	11	\N	20	2024-01-04 16:03:36.36	2024-01-04 16:13:43.366	APPROVED_PANEL
10	This is a sample ads-request reason.	CANCELED	Panel	2	\N	1	2023-12-30 14:24:22.01	2024-01-04 16:17:04.87	APPROVED_PANEL
9	This is a sample ads-request reason.	CANCELED	Panel	2	\N	1	2023-12-30 14:24:21.306	2024-01-04 16:25:28.179	APPROVED_PANEL
22	ABCDDD	PENDING	Panel	11	\N	18	2024-01-05 07:12:52.499	2024-01-05 07:12:52.499	APPROVED_PANEL
23	BCDDDD	PENDING	Panel	11	\N	18	2024-01-05 07:13:41.954	2024-01-05 07:13:41.954	APPROVED_PANEL
24	123123	PENDING	Panel	11	\N	18	2024-01-05 07:14:22.321	2024-01-05 07:14:22.321	APPROVED_PANEL
25	123123	PENDING	Panel	11	\N	19	2024-01-05 07:14:51.162	2024-01-05 07:14:51.162	APPROVED_PANEL
26	123	PENDING	Panel	11	\N	13	2024-01-05 07:16:06.496	2024-01-05 07:16:06.496	APPROVED_PANEL
27	333	PENDING	Panel	11	\N	12	2024-01-05 07:16:36.18	2024-01-05 07:16:36.18	APPROVED_PANEL
28	000333	PENDING	Panel	11	\N	18	2024-01-05 07:21:19.439	2024-01-05 07:21:19.439	APPROVED_PANEL
29	123000	PENDING	Panel	11	\N	12	2024-01-05 07:21:37.709	2024-01-05 07:21:37.709	APPROVED_PANEL
30	0123	PENDING	Panel	11	\N	12	2024-01-05 07:22:06.461	2024-01-05 07:22:06.461	APPROVED_PANEL
31	Haha	PENDING	Panel	11	\N	12	2024-01-05 07:23:20.182	2024-01-05 07:23:20.182	APPROVED_PANEL
32	123Haha	PENDING	Panel	11	\N	18	2024-01-05 07:23:37.46	2024-01-05 07:23:37.46	APPROVED_PANEL
1	This is a sample ads-request reason.	REJECTED	Panel	2	\N	1	2023-12-30 07:33:56.216	2024-01-13 13:17:19.672	APPROVED_PANEL
12	lkjlklkjlk	REJECTED	Location	2	12	\N	2023-12-30 15:58:11.879	2024-01-05 14:10:15.412	UPDATE_DATA
33	Change width	CANCELED	Panel	2	\N	23	2024-01-08 20:21:20.74	2024-01-08 20:24:48.713	UPDATE_DATA
34	Add image	CANCELED	Location	2	20	\N	2024-01-08 20:23:54.073	2024-01-08 20:25:07.062	UPDATE_DATA
21	This is a sample ads-request reason.	CANCELED	Panel	11	\N	20	2024-01-05 06:48:09.288	2024-01-09 20:24:09.388	APPROVED_PANEL
8	This is a sample ads-request reason.	CANCELED	Panel	2	\N	1	2023-12-30 14:24:20.548	2024-01-09 20:24:27.712	APPROVED_PANEL
35	123	CANCELED	Panel	2	\N	29	2024-01-09 21:16:23.101	2024-01-09 21:16:42.232	APPROVED_PANEL
36	abc	PENDING	Panel	2	\N	30	2024-01-10 09:09:55.498	2024-01-10 09:09:55.498	UPDATE_DATA
38	Please approve this panel	CANCELED	Panel	14	\N	32	2024-01-11 15:09:38.36	2024-01-11 15:18:23.026	APPROVED_PANEL
39	Haha	PENDING	Panel	14	\N	32	2024-01-11 15:18:40.635	2024-01-11 15:18:40.635	APPROVED_PANEL
46	Cần chỉnh sửa thông tin	PENDING	Panel	2	\N	42	2024-01-13 13:17:58.48	2024-01-13 13:17:58.48	UPDATE_DATA
47	Cần chỉnh sửa thông tin	PENDING	Location	2	30	\N	2024-01-13 13:18:07.567	2024-01-13 13:18:07.567	UPDATE_DATA
\.


--
-- TOC entry 2669 (class 0 OID 163911)
-- Dependencies: 223
-- Data for Name: advertisement_type; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.advertisement_type (id, name) FROM stdin;
1	Cổ động chính trị
2	Quảng cáo thương mại
3	Xã hội hoá
\.


--
-- TOC entry 2671 (class 0 OID 163920)
-- Dependencies: 225
-- Data for Name: district; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.district (id, name) FROM stdin;
1	Thành Phố Thủ Đức
2	Huyện Cần Giờ
3	Huyện Nhà Bè
4	Huyện Bình Chánh
5	Quận Bình Thạnh
6	Quận Gò Vấp
7	Huyện Củ Chi
8	Huyện Hóc Môn
9	Quận Bình Tân Update
10	Quận Phú Nhuận
11	Quận Tân Phú
12	Quận Tân Bình
13	Quận 12
14	Quận 11
15	Quận 10
16	Quận 8
17	Quận 7
18	Quận 6
19	Quận 5
20	Quận 4
21	Quận 3
22	Quận 1
\.


--
-- TOC entry 2665 (class 0 OID 163890)
-- Dependencies: 219
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.location (id, lat, long, is_planning, district_id, ward_id, full_address, type_id, ad_type_id, image_urls, created_at, updated_at, name, belong_location_id, status) FROM stdin;
8	5.000000000000000000000000000000	20.000000000000000000000000000000	t	1	1	227 Nguyen Van Cu	1	1	{}	2023-12-30 06:38:43.188	2023-12-30 06:38:43.188	Location 1	\N	APPROVED
12	5.000000000000000000000000000000	20.000000000000000000000000000000	t	1	2	kkjhkhkbkb 	1	1	\N	2023-12-30 15:58:11.879	2023-12-30 15:58:11.879	akjhskjhskj	5	AWAITING_UPDATE
1	10.848383900000000000000000000000	106.658694800000000000000000000000	t	1	1	227 Nguyen Van Cu	1	1	{}	2023-12-30 06:38:16.323	2024-01-02 01:47:22.546	Location 1	\N	APPROVED
5	10.849977500000000000000000000000	106.661656900000000000000000000000	t	1	1	227 Nguyen Van Cu	1	1	{}	2023-12-30 06:38:36.934	2024-01-10 15:33:36.528	Chợ Xóm Mới	\N	APPROVED
9	5.000000000000000000000000000000	20.000000000000000000000000000000	t	1	2	227 Nguyen Van Cu	1	1	{}	2023-12-30 06:38:44.543	2023-12-30 06:38:44.543	Location 1	\N	APPROVED
13	5.000000000000000000000000000000	20.000000000000000000000000000000	t	1	2	227 Nguyen Van Cu	2	3	{}	2023-12-30 06:38:45.924	2023-12-30 06:38:45.924	Location 1	\N	APPROVED
17	5.000000000000000000000000000000	20.000000000000000000000000000000	t	1	2	227 Nguyen Van Cu	1	1	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704356457953-shopee.png?alt=media}	2024-01-04 08:21:00.341	2024-01-04 08:21:00.341	Location 13	13	AWAITING_UPDATE
18	5.000000000000000000000000000000	20.000000000000000000000000000000	t	1	2	227 Nguyen Van Cu	1	1	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704359949655-shopee.png?alt=media}	2024-01-04 09:19:13.128	2024-01-04 09:19:13.128	Location 13	13	AWAITING_UPDATE
21	10.749965000000000000000000000000	106.643068000000000000000000000000	f	18	262	188 Hậu Giang	3	2	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704891567567-1.jpg?alt=media}	2024-01-10 12:59:31.842	2024-01-10 12:59:31.842	Co.opmart Hậu Giang	\N	APPROVED
7	5.000000000000000000000000000000	20.000000000000000000000000000000	t	2	2	227 Nguyen Van Cu	1	1	{}	2023-12-30 06:38:41.878	2023-12-30 06:38:41.878	Location 1	\N	APPROVED
20	5.000000000000000000000000000000	20.000000000000000000000000000000	t	1	1	227 Nguyen Van Cu	1	1	{"https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704745432377-Screenshot from 2024-01-09 02-09-49.png?alt=media"}	2024-01-08 20:23:54.073	2024-01-08 20:23:54.073	Location 1	10	AWAITING_UPDATE
25	5.000000000000000000000000000000	20.000000000000000000000000000000	t	1	1	kkjhkhkbkb 	1	1	{"https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704989673103-Screenshot 2023-12-24 155418.png?alt=media","https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704989673104-Activity Diagram_ Android Application.png?alt=media"}	2024-01-11 08:34:00.46	2024-01-11 17:16:40.045	location mới nè	5	AWAITING_UPDATE
30	5.000000000000000000000000000000	20.000000000000000000000000000000	t	1	2	227, Nguyễn Văn Cừ, Quận 5	1	1	{"https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1705151885894-Activity Diagram_ Android Application.png?alt=media"}	2024-01-13 13:18:07.567	2024-01-13 13:18:07.567	Trường đại học Khoa học Tự nhiên	5	AWAITING_UPDATE
2	5.000000000000000000000000000000	20.000000000000000000000000000000	t	1	2	kkjhkhkbkb 	1	1	{"https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704976818774-Activity Diagram_ Android Application.png?alt=media"}	2023-12-30 06:38:32.598	2024-01-11 12:40:20.14	akjhskjhskj	5	AWAITING_UPDATE
34	10.749691225133400000000000000000	106.646686763498000000000000000000	t	18	262	80 Hậu Giang	2	2	{}	2024-01-14 05:12:12.349	2024-01-14 05:12:12.349	Techcombank Chi Nhánh Hậu Giang	\N	APPROVED
6	10.754517700000000000000000000000	101.704225200000000000000000000000	f	1	1	227 Nguyen Van Cu	1	1	{}	2023-12-30 06:38:40.562	2024-01-09 16:53:16.593	Chợ Lớn	\N	APPROVED
3	10.836191900000000000000000000000	106.656433100000000000000000000000	f	1	1	227 Nguyen Van Cu	1	1	{}	2023-12-30 06:38:34.119	2024-01-09 16:54:18.087	Chợ Hạnh Thông Tây	\N	APPROVED
4	10.838124500000000000000000000000	106.668737500000000000000000000000	f	1	1	227 Nguyen Van Cu	1	1	{}	2023-12-30 06:38:35.574	2024-01-09 16:56:20.355	Lotte Nguyễn Văn Lượng	\N	APPROVED
27	10.749965000000000000000000000000	106.643068000000000000000000000000	f	18	262	188 Hậu Giang	3	2	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704987520342-cm.jpg?alt=media}	2024-01-11 15:38:43.137	2024-01-11 15:38:43.137	Co.opmart Hậu Giang	21	AWAITING_UPDATE
10	10.772522100000000000000000000000	106.695445900000000000000000000000	f	1	1	227 Nguyen Van Cu	1	1	{}	2023-12-30 06:38:45.924	2024-01-09 17:00:42.343	Chợ Bến Thành	\N	APPROVED
33	10.762584400000000000000000000000	106.681685200000000000000000000000	t	1	1	test add	1	1	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1705156171233-screencapture-discord-channels-me-2023-11-27-21_46_16.png?alt=media,https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1705156171239-screencapture-discord-channels-me-2023-11-27-21_35_53.png?alt=media}	2024-01-13 14:29:33.284	2024-01-13 14:29:33.284	test loc	\N	APPROVED
28	10.749760000000000000000000000000	106.651010000000000000000000000000	f	18	266	57A Tháp Mười	4	3	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704988683704-2.jpg?alt=media}	2024-01-11 15:58:06.156	2024-01-11 15:58:06.156	Chợ Bình Tây	22	AWAITING_UPDATE
37	10.742657283446180000000000000000	106.632689513166300000000000000000	t	18	258	20U Cư Xá Phú Lâm D	1	1	{}	2024-01-14 05:30:09.385	2024-01-14 05:30:09.385	Công viên Bình Phú	\N	APPROVED
22	10.749760000000000000000000000000	106.651010000000000000000000000000	f	18	266	57A Tháp Mười	4	3	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704891905934-2.jpg?alt=media}	2024-01-10 13:05:07.777	2024-01-10 13:05:07.777	Chợ Bình Tây	\N	APPROVED
38	10.746632050275880000000000000000	106.637676731891600000000000000000	t	18	258	491 Hậu Giang	2	2	{}	2024-01-14 05:38:05.426	2024-01-14 05:38:05.426	Chung cư Him Lam Chợ Lớn	\N	APPROVED
35	10.751255461894160000000000000000	106.651929802033400000000000000000	f	18	266	46 Lê Quang Sung	6	3	{}	2024-01-14 05:16:30.769	2024-01-14 05:16:30.769	Bến xe Chợ Lớn	\N	APPROVED
23	10.747446000000000000000000000000	106.643110000000000000000000000000	f	18	263	247A Phan Văn Khỏe	5	2	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704892290845-3.jpg?alt=media}	2024-01-10 13:11:32.742	2024-01-10 13:11:32.742	Trạm xăng dầu SAIGON PETRO số 9	\N	APPROVED
36	10.747070540676230000000000000000	106.642151241559400000000000000000	f	18	263	3 Bãi Sậy	1	2	{}	2024-01-14 05:24:43.431	2024-01-14 05:24:43.431	Công viên Phạm Đình Hổ	\N	APPROVED
\.


--
-- TOC entry 2667 (class 0 OID 163902)
-- Dependencies: 221
-- Data for Name: location_type; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.location_type (id, name) FROM stdin;
1	Đất công/Công viên/Hành lang an toàn giao thông
2	Đất tư nhân/Nhà ở riêng lẻ
3	Trung tâm thương mại
4	Chợ
5	Cây xăng
6	Nhà chờ xe buýt
\.


--
-- TOC entry 2661 (class 0 OID 163870)
-- Dependencies: 215
-- Data for Name: panel; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.panel (id, type_id, width, height, location_id, image_urls, create_contract_date, expired_contract_date, company_email, company_number, created_at, updated_at, status, belong_panel_id) FROM stdin;
4	1	1.000000000000000000000000000000	1.500000000000000000000000000000	2	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1703918510071-shopee.png?alt=media}	2023-12-23 00:00:00	2024-12-23 00:00:00	example@example.com	123456789	2023-12-30 06:41:51.943	2023-12-30 06:41:51.943	DRAFT	\N
5	1	1.000000000000000000000000000000	1.500000000000000000000000000000	2	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1703918512971-shopee.png?alt=media}	2023-12-23 00:00:00	2024-12-23 00:00:00	example@example.com	123456789	2023-12-30 06:41:55.39	2023-12-30 06:41:55.39	DRAFT	\N
6	1	1.000000000000000000000000000000	1.500000000000000000000000000000	3	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1703918518590-shopee.png?alt=media}	2023-12-23 00:00:00	2024-12-23 00:00:00	example@example.com	123456789	2023-12-30 06:42:00.71	2023-12-30 06:42:00.71	DRAFT	\N
7	1	1.000000000000000000000000000000	1.500000000000000000000000000000	3	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1703918521679-shopee.png?alt=media}	2023-12-23 00:00:00	2024-12-23 00:00:00	example@example.com	123456789	2023-12-30 06:42:03.64	2023-12-30 06:42:03.64	DRAFT	\N
8	1	1.000000000000000000000000000000	1.500000000000000000000000000000	4	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1703918527823-shopee.png?alt=media}	2023-12-23 00:00:00	2024-12-23 00:00:00	example@example.com	123456789	2023-12-30 06:42:09.999	2023-12-30 06:42:09.999	DRAFT	\N
9	1	1.000000000000000000000000000000	1.500000000000000000000000000000	5	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1703918534474-shopee.png?alt=media}	2023-12-23 00:00:00	2024-12-23 00:00:00	example@example.com	123456789	2023-12-30 06:42:16.506	2023-12-30 06:42:16.506	DRAFT	\N
1	1	1.000000000000000000000000000000	1.500000000000000000000000000000	1	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1703918486230-shopee.png?alt=media}	2023-12-23 00:00:00	2024-12-23 00:00:00	example@example.com	123456789	2023-12-30 06:41:29.936	2023-12-30 06:41:29.936	APPROVED	\N
3	1	1.000000000000000000000000000000	1.500000000000000000000000000000	1	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1703918502994-shopee.png?alt=media}	2023-12-23 00:00:00	2024-12-23 00:00:00	example@example.com	123456789	2023-12-30 06:41:45.208	2023-12-30 06:41:45.208	APPROVED	\N
10	1	10.000000000000000000000000000000	20.000000000000000000000000000000	5	{"https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1703951748111-Activity Diagram_ Android Application.png?alt=media"}	2023-12-23 00:00:00	2024-12-23 00:00:00	example@example.com	123456789	2023-12-30 15:55:49.928	2023-12-30 15:55:49.928	AWAITING_UPDATE	2
11	1	10.000000000000000000000000000000	20.000000000000000000000000000000	5	{}	2023-12-23 00:00:00	2024-12-23 00:00:00	example@example.com	123456789	2024-01-02 13:54:38.051	2024-01-02 13:54:38.051	DRAFT	\N
12	2	2.000000000000000000000000000000	1.000000000000000000000000000000	9	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704205649383-shopee.png?alt=media}	2024-01-10 00:00:00	2024-02-01 00:00:00	shopee@gmail.com	0123123123	2024-01-02 14:27:31.153	2024-01-02 14:27:31.153	DRAFT	\N
13	8	1.000000000000000000000000000000	2.000000000000000000000000000000	9	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704206782380-shopee.png?alt=media}	2024-01-17 00:00:00	2024-01-27 00:00:00	shopee@gmail.com	0123123123	2024-01-02 14:46:24.73	2024-01-02 14:46:24.73	DRAFT	\N
15	6	3.000000000000000000000000000000	5.000000000000000000000000000000	8	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704206961933-shopee.png?alt=media}	2024-01-11 00:00:00	2024-01-27 00:00:00	shopee@gmail.com	0123123123	2024-01-02 14:49:23.587	2024-01-02 14:49:23.587	DRAFT	\N
14	6	2.000000000000000000000000000000	3.000000000000000000000000000000	9	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704206892662-shopee.png?alt=media}	2024-01-11 00:00:00	2024-01-27 00:00:00	shopee@gmail.com	0123123123	2024-01-02 14:48:14.041	2024-01-02 14:48:14.041	APPROVED	\N
16	1	10.000000000000000000000000000000	20.000000000000000000000000000000	9	\N	2023-12-23 00:00:00	2024-12-23 00:00:00	example@example.com	123456789	2024-01-04 09:35:08.079	2024-01-04 09:35:08.079	AWAITING_UPDATE	14
17	3	3.000000000000000000000000000000	2.000000000000000000000000000000	9	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704379472818-shopee.png?alt=media}	2024-01-18 00:00:00	2024-01-19 00:00:00	shopee@gmail.com	0123123123	2024-01-04 14:44:35.146	2024-01-04 14:44:35.146	AWAITING_UPDATE	14
18	2	5.000000000000000000000000000000	10.000000000000000000000000000000	9	{"https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704383418058-Screenshot from 2024-01-04 15-01-25.png?alt=media"}	2024-01-18 00:00:00	2024-01-19 00:00:00	grab@gmail.com	090123456789	2024-01-04 15:50:19.571	2024-01-04 15:50:19.571	DRAFT	\N
19	4	5.000000000000000000000000000000	10.000000000000000000000000000000	9	{"https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704383623063-Screenshot from 2024-01-04 16-22-45.png?alt=media"}	2024-01-25 00:00:00	2024-01-31 00:00:00	grab@gmail.com	090123123123	2024-01-04 15:53:44.248	2024-01-04 15:53:44.248	DRAFT	\N
20	1	10.000000000000000000000000000000	20.000000000000000000000000000000	5	{}	2023-12-23 00:00:00	2024-12-23 00:00:00	example@example.com	123456789	2024-01-04 15:56:45.218	2024-01-04 15:56:45.218	DRAFT	\N
21	5	2.000000000000000000000000000000	3.000000000000000000000000000000	3	{"https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704743250738-Screenshot from 2024-01-08 23-17-08.png?alt=media"}	2024-01-18 00:00:00	2024-01-25 00:00:00	shopee@gmail.com	0123123123	2024-01-08 19:47:33.891	2024-01-08 19:47:33.891	DRAFT	\N
23	5	5.000000000000000000000000000000	3.000000000000000000000000000000	3	\N	2024-01-18 00:00:00	2024-02-02 00:00:00	shopee@gmail.com	0123123123	2024-01-08 20:21:20.74	2024-01-08 20:21:20.74	AWAITING_UPDATE	21
24	9	5.000000000000000000000000000000	10.000000000000000000000000000000	10	{"https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704828965027-Screenshot from 2024-01-09 22-32-49.png?alt=media"}	2024-01-25 00:00:00	2024-02-10 00:00:00	lazada@gmail.com	0123123123	2024-01-09 19:36:06.737	2024-01-09 19:36:06.737	DRAFT	\N
25	1	5.000000000000000000000000000000	12.000000000000000000000000000000	4	{"https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704829209906-Screenshot from 2024-01-09 17-23-37.png?alt=media"}	2024-01-11 00:00:00	2024-02-01 00:00:00	company@gmail.com	123123	2024-01-09 19:40:12.372	2024-01-09 19:40:12.372	DRAFT	\N
26	2	12.000000000000000000000000000000	20.000000000000000000000000000000	6	{"https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704829962572-Screenshot from 2024-01-09 22-17-33.png?alt=media"}	2024-01-16 00:00:00	2024-01-25 00:00:00	company@gmail.com	123123	2024-01-09 19:52:44.558	2024-01-09 19:52:44.558	DRAFT	\N
28	5	5.000000000000000000000000000000	10.000000000000000000000000000000	10	{"https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704831120325-Screenshot from 2024-01-09 03-24-51.png?alt=media"}	2024-01-22 00:00:00	2024-02-02 00:00:00	company@gmail.com	0123123132	2024-01-09 20:12:03.495	2024-01-09 20:12:03.495	DRAFT	\N
29	6	1.000000000000000000000000000000	5.000000000000000000000000000000	6	{"https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704834974295-Screenshot from 2024-01-09 22-32-49.png?alt=media"}	2024-01-26 00:00:00	2024-02-01 00:00:00	gmail@gmail.com	0123123123	2024-01-09 21:16:15.929	2024-01-09 21:16:15.929	DRAFT	\N
2	1	10.000000000000000000000000000000	20.000000000000000000000000000000	5	{"https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704989137018-Activity Diagram_ Android Application.png?alt=media"}	2023-12-23 00:00:00	2024-12-23 00:00:00	example@example.com	123456789	2023-12-30 06:41:41.207	2024-01-11 16:05:38.491	AWAITING_UPDATE	3
30	1	10.000000000000000000000000000000	20.000000000000000000000000000000	5	{"https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704877793765-Activity Diagram_ Android Application.png?alt=media"}	2023-12-23 00:00:00	2024-12-23 00:00:00	example@example.com	123456789	2024-01-10 09:09:55.498	2024-01-10 09:09:55.498	AWAITING_UPDATE	2
37	7	3.000000000000000000000000000000	2.000000000000000000000000000000	22	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704907982431-bvmt.jpg?alt=media}	2024-01-11 00:00:00	2025-01-11 00:00:00	contact@district6.com	0924102002	2024-01-10 17:33:06.155	2024-01-10 17:33:06.155	DRAFT	\N
35	5	3.000000000000000000000000000000	2.000000000000000000000000000000	21	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704907828298-simple.jpg?alt=media}	2024-01-11 00:00:00	2025-01-11 00:00:00	contact@simple.com	0924102002	2024-01-10 17:30:29.878	2024-01-10 17:30:29.878	DRAFT	\N
33	2	5.000000000000000000000000000000	4.000000000000000000000000000000	21	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704907655272-lazadalazada.jpg?alt=media}	2024-01-11 00:00:00	2025-01-11 00:00:00	contact@lazada.com	0924102002	2024-01-10 17:27:37.787	2024-01-10 17:27:37.787	APPROVED	\N
34	7	5.000000000000000000000000000000	4.000000000000000000000000000000	21	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704907726386-omo.jpg?alt=media}	2024-01-11 00:00:00	2025-01-11 00:00:00	contact@omo.com	0924102002	2024-01-10 17:28:49.524	2024-01-10 17:28:49.524	APPROVED	\N
38	2	3.000000000000000000000000000000	2.000000000000000000000000000000	21	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704908098226-shopeeshopee.jpg?alt=media}	2024-01-11 00:00:00	2025-01-11 00:00:00	contact@shopee.com	0924102002	2024-01-10 17:35:00.729	2024-01-10 17:35:00.729	APPROVED	\N
36	7	3.000000000000000000000000000000	2.000000000000000000000000000000	22	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704907956267-tldt.jpg?alt=media}	2024-01-11 00:00:00	2025-01-11 00:00:00	contact@district6.com	0924102002	2024-01-10 17:32:39.529	2024-01-10 17:32:39.529	APPROVED	\N
32	2	5.000000000000000000000000000000	4.000000000000000000000000000000	23	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704907545325-be.jpg?alt=media}	2024-01-11 00:00:00	2025-01-11 00:00:00	contact@be.com	0924102002	2024-01-10 17:25:49.27	2024-01-10 17:25:49.27	DRAFT	\N
40	2	3.000000000000000000000000000000	2.000000000000000000000000000000	23	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704986356716-be.jpg?alt=media}	2024-01-20 00:00:00	2024-01-31 00:00:00	contact@be.com	0924102002	2024-01-11 15:19:19.534	2024-01-11 15:19:19.534	AWAITING_UPDATE	32
41	7	3.000000000000000000000000000000	2.000000000000000000000000000000	22	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1704986630257-tldt.jpg?alt=media}	2024-02-01 00:00:00	2024-02-10 00:00:00	contact@district6.com	0924102002	2024-01-11 15:23:52.188	2024-01-11 15:23:52.188	AWAITING_UPDATE	36
42	1	10.000000000000000000000000000000	20.000000000000000000000000000000	5	{"https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1705151876439-Activity Diagram_ Android Application.png?alt=media"}	2023-12-23 00:00:00	2024-12-23 00:00:00	example@example.com	123456789	2024-01-13 13:17:58.48	2024-01-13 13:17:58.48	AWAITING_UPDATE	3
43	1	10.000000000000000000000000000000	20.000000000000000000000000000000	5	{}	2023-12-23 00:00:00	2024-12-23 00:00:00	example@example.com	123456789	2024-01-13 13:18:32.108	2024-01-13 13:18:32.108	DRAFT	\N
44	1	10.000000000000000000000000000000	20.000000000000000000000000000000	5	{"https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1705151938772-Screenshot 2023-12-24 155418.png?alt=media"}	2023-12-23 00:00:00	2024-12-23 00:00:00	example@example.com	123456789	2024-01-13 13:18:59.954	2024-01-13 13:18:59.954	DRAFT	\N
39	3	44.000000000000000000000000000000	33.000000000000000000000000000000	25	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1705157254896-screencapture-discord-channels-me-2023-11-27-21_46_16.png?alt=media}	2024-01-11 08:48:50	2024-01-11 08:48:50	sth@gmail.com	123456	2024-01-11 08:49:19.468	2024-01-13 14:47:37.2	APPROVED	\N
\.


--
-- TOC entry 2663 (class 0 OID 163881)
-- Dependencies: 217
-- Data for Name: panel_type; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.panel_type (id, name) FROM stdin;
1	Trụ bảng hiflex
2	Trụ màn hình điện tử LED
3	Trụ hộp đèn
4	Bảng hiflex ốp tường
5	Màn hình điện tử ốp tường
6	Trụ treo băng rôn dọc
7	Trụ treo băng rôn ngang
8	Trụ/Cụm pano
9	Cổng chào
10	Trung tâm thương mại
\.


--
-- TOC entry 2677 (class 0 OID 163949)
-- Dependencies: 231
-- Data for Name: report; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.report (id, type_id, full_name, email, content, image_urls, target_type, location_id, panel_id, status, resolved_content, created_at, updated_at, user_uuid, lat, long, district_id, ward_id) FROM stdin;
12	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Panel	\N	12	NEW		2024-01-07 13:58:45.735	2024-01-07 13:58:45.735	2412341234-asfasdfasdf	\N	\N	\N	\N
13	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	5	\N	NEW		2024-01-07 13:59:01.531	2024-01-07 13:59:01.531	2412341234-asfasdfasdf	\N	\N	\N	\N
14	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	7	\N	NEW		2024-01-07 13:59:09.127	2024-01-07 13:59:09.127	2412341234-asfasdfasdf	\N	\N	\N	\N
15	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	7	\N	NEW		2024-01-07 13:59:14.621	2024-01-07 13:59:14.621	2412341234-asfasdfasdf	\N	\N	\N	\N
16	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	7	\N	NEW		2024-01-07 14:00:51.049	2024-01-07 14:00:51.049	2412341234-asfasdfasdf	\N	\N	\N	\N
17	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	7	\N	NEW		2024-01-07 14:01:30.914	2024-01-07 14:01:30.914	2412341234-asfasdfasdf	\N	\N	\N	\N
18	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	7	\N	NEW		2024-01-07 14:01:50.495	2024-01-07 14:01:50.495	2412341234-asfasdfasdf	\N	\N	\N	\N
19	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	8	\N	NEW		2024-01-07 14:04:12.067	2024-01-07 14:04:12.067	2412341234-asfasdfasdf	\N	\N	\N	\N
20	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	7	\N	NEW		2024-01-07 14:04:23.62	2024-01-07 14:04:23.62	2412341234-asfasdfasdf	\N	\N	\N	\N
21	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	7	\N	NEW		2024-01-07 14:04:55.408	2024-01-07 14:04:55.408	2412341234-asfasdfasdf	\N	\N	\N	\N
22	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	7	\N	NEW		2024-01-07 14:06:47.466	2024-01-07 14:06:47.466	2412341234-asfasdfasdf	\N	\N	\N	\N
23	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	7	\N	NEW		2024-01-07 14:13:47.385	2024-01-07 14:13:47.385	2412341234-asfasdfasdf	\N	\N	\N	\N
7	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	5	\N	NEW		2024-01-06 14:10:19.885	2024-01-06 14:10:19.885	2412341234-asfasdfasdf	\N	\N	\N	\N
29	1	Nguyễn Quốc Huy	huykst137@gmail.com	<p>hjdsf</p>	{}	Panel	\N	3	NEW		2024-01-08 11:37:30.785	2024-01-08 11:37:30.785	d469ef79-5ca7-467e-9274-01f9454ad161	\N	\N	\N	\N
2	1	Tri	tri@gmail.com	So bad	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1703918486230-shopee.png?alt=media}	Location	7	\N	NEW	 	2023-12-23 00:00:00	2023-12-23 00:00:00	123123	\N	\N	\N	\N
3	1	Tri	tri@gmail.com	So bad	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1703918486230-shopee.png?alt=media}	Panel	\N	3	NEW	 	2023-12-23 00:00:00	2023-12-23 00:00:00	123123	\N	\N	\N	\N
4	1	Tri	tri@gmail.com	So bad	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1703918486230-shopee.png?alt=media}	Panel	\N	4	NEW	 	2023-12-23 00:00:00	2023-12-23 00:00:00	123123	\N	\N	\N	\N
5	1	Tri	tri@gmail.com	So bad	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1703918486230-shopee.png?alt=media}	Panel	\N	5	NEW	 	2023-12-23 00:00:00	2023-12-23 00:00:00	123123	\N	\N	\N	\N
8	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	5	\N	NEW		2024-01-07 13:51:45.507	2024-01-07 13:51:45.507	2412341234-asfasdfasdf	\N	\N	\N	\N
9	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	5	\N	NEW		2024-01-07 13:56:07.341	2024-01-07 13:56:07.341	2412341234-asfasdfasdf	\N	\N	\N	\N
10	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Panel	\N	12	NEW		2024-01-07 13:56:43.801	2024-01-07 13:56:43.801	2412341234-asfasdfasdf	\N	\N	\N	\N
11	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Panel	\N	12	NEW		2024-01-07 13:58:23.889	2024-01-07 13:58:23.889	2412341234-asfasdfasdf	\N	\N	\N	\N
30	1	Nguyễn Quốc Huy	huykst137@gmail.com	<p>sdadasd</p>	{}	Panel	\N	3	NEW		2024-01-08 11:41:03.386	2024-01-08 11:41:03.386	638000e0-599e-4fc0-9eab-d0f5a4a62f9d	\N	\N	\N	\N
31	1	Huy Nguyễn	huykst137@gmail.com	<p>dsfdsfdsfd</p>	{}	Panel	\N	3	NEW		2024-01-08 11:45:06.032	2024-01-08 11:45:06.032	64baaec8-bbc0-404c-978e-6b48ac0a7c48	\N	\N	\N	\N
32	1	Nguyễn Quốc Huy	huykst137@gmail.com	<p>dsfdsfdsf</p>	{}	Panel	\N	3	NEW		2024-01-08 11:46:32.296	2024-01-08 11:46:32.296	e4c68a2e-ed5a-4616-88f4-34438a61dc15	\N	\N	\N	\N
33	1	Nguyễn Quốc Huy	huykst137@gmail.com	<p>dsfdsfdsf</p>	{}	Panel	\N	3	NEW		2024-01-08 11:47:34.274	2024-01-08 11:47:34.274	8738aa81-bb91-4cbe-9d84-eab7f77f0821	\N	\N	\N	\N
34	1	Nguyễn Quốc Huy	huykst137@gmail.com	<p>sad</p>	{}	Panel	\N	3	NEW		2024-01-08 11:47:55.907	2024-01-08 11:47:55.907	b12aa161-98db-49f7-ad07-4fd54755f6c4	\N	\N	\N	\N
1	1	Tri	tri@gmail.com	So bad	{https://firebasestorage.googleapis.com/v0/b/ads-management-a274a.appspot.com/o/report%2F1703918486230-shopee.png?alt=media}	Location	1	\N	NEW	ppp	2023-12-23 00:00:00	2024-01-07 14:47:03.247	123123	\N	\N	\N	\N
6	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	5	\N	NEW	ppp	2024-01-05 15:27:05.505	2024-01-07 14:47:10.627	2412341234-asfasdfasdf	\N	\N	\N	\N
24	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	7	\N	NEW		2024-01-07 14:47:35.075	2024-01-07 14:47:35.075	2412341234-asfasdfasdf	\N	\N	\N	\N
26	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	5	\N	NEW		2024-01-08 09:54:59.287	2024-01-08 09:54:59.287	2412341234-asfasdfasdf	\N	\N	\N	\N
28	1	Nguyễn Quốc Huy	huykst137@gmail.com	<p>hjdsf</p>	{}	Panel	\N	3	NEW		2024-01-08 11:36:28.539	2024-01-08 11:36:28.539	e749609e-ddc0-4f0f-acdd-63a584973fa4	\N	\N	\N	\N
38	1	Nguyễn Quốc Huy	huykst137@gmail.com	<p>dfgdfgdfgfd</p>	{}	Panel	\N	3	DONE	123	2024-01-08 11:55:01.093	2024-01-08 18:50:59.016	a92643cc-da68-42c7-a254-2f7f936a3592	\N	\N	\N	\N
36	1	Nguyễn Quốc Huy	huykst137@gmail.com	<p>dfdsfgdfgdfg</p>	{}	Panel	\N	3	DONE	Haha	2024-01-08 11:51:02.116	2024-01-08 19:02:02.105	b833884a-3e96-4286-b714-fd1de3d87e5e	\N	\N	\N	\N
37	1	Nguyễn Quốc Huy	huykst137@gmail.com	<p>dfgdfgdfgfd</p>	{}	Panel	\N	3	DONE	321	2024-01-08 11:53:40.737	2024-01-09 20:25:42.816	f90429db-be8b-45e3-9f89-1ca1d94dc64a	\N	\N	\N	\N
25	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	5	\N	DONE	No problem	2024-01-07 14:47:45.403	2024-01-08 18:54:02.064	2412341234-asfasdfasdf	\N	\N	\N	\N
35	1	Nguyễn Quốc Huy	huykst137@gmail.com	<p>dsfsdfds</p>	{}	Panel	\N	3	PENDING	333	2024-01-08 11:50:05.715	2024-01-08 18:55:39.67	d32d7b5e-04b2-4a0b-ba28-48ebf38f0187	\N	\N	\N	\N
27	1	Thong	9a3.12.khai@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	5	\N	DONE	Nộp đơn tại XYZT	2024-01-08 10:04:10.103	2024-01-13 13:13:41.647	2412341234-asfasdfasdf	\N	\N	\N	\N
39	1	Nguyễn Quốc Huy	huykst137@gmail.com	<p>dfgdfgdfgfd</p>	{}	Panel	\N	3	PENDING	We processed the problem. Thank you for reporting	2024-01-08 11:57:51.59	2024-01-08 18:49:10.254	9744bde8-253d-45da-bb22-4092d0b21986	\N	\N	\N	\N
61	1	Tri Do	minhtri.do2410@gmail.com	<p>123123</p>	{}	Panel	\N	1	NEW		2024-01-13 12:09:43.566	2024-01-13 12:09:43.566	c6e2ef40-5bc4-43ff-8ab3-4d914931237b	\N	\N	\N	\N
62	1	Tri Do	minhtri.do2410@gmail.com	<p>123123</p>	{}	Panel	\N	1	NEW		2024-01-13 12:11:22.134	2024-01-13 12:11:22.134	a014f0e4-c03b-441f-a10a-24a4ad3be6f7	\N	\N	\N	\N
40	1	Nguyễn Quốc Huy	huykst137@gmail.com	<p>fdgdfgdfg</p>	{}	Panel	\N	3	PENDING	Done	2024-01-08 12:01:12.067	2024-01-09 20:23:45.805	a9c0e08e-b53e-44d6-9501-bafbfb9600cd	\N	\N	\N	\N
41	1	Huy Nguyen	huy@gmail.com	<p>sadsadasd</p>	{}	Location	2	\N	PENDING	Done 	2024-01-09 02:16:55.872	2024-01-09 20:25:35.645	b803747e-a96a-42f9-8412-11b90d95fff9	\N	\N	\N	\N
42	1	Huy Nguyen	huy@gmail.com	<p>dsfdsfdsfdsf</p>	{}	Panel	\N	25	NEW		2024-01-10 16:08:54.786	2024-01-10 16:08:54.786	b803747e-a96a-42f9-8412-11b90d95fff9	\N	\N	\N	\N
63	1	Tri Do	minhtri.do2410@gmail.com	<p>123123</p>	{}	Panel	\N	1	NEW		2024-01-13 12:15:44.583	2024-01-13 12:15:44.583	6f5521dd-1747-43d7-aa2c-72e4eeea165a	\N	\N	\N	\N
64	1	Tri Do	minhtri.do2410@gmail.com	<p>123123</p>	{}	Panel	\N	1	NEW		2024-01-13 12:16:44.276	2024-01-13 12:16:44.276	5a180049-d572-4449-ad44-2aa0e71338d7	\N	\N	\N	\N
65	1	Tri	mitidevus@gmail.com	<p>123123</p>	{}	Panel	\N	1	NEW		2024-01-13 12:18:02.529	2024-01-13 12:18:02.529	54753681-d3e2-47d5-ae8f-557d6c158fa5	\N	\N	\N	\N
44	3	Tri Do	minhtri.do2410@gmail.com	<p>It's so dark, I think you should add some lights.</p>	{}	Panel	\N	34	PENDING	We are processing	2024-01-11 09:40:01.499	2024-01-11 14:17:00.181	67a43120-6d2a-4cd5-8aa6-bf37e1986466	\N	\N	\N	\N
43	3	Do Minh Tri	mitidevus@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	23	\N	NEW		2024-01-11 09:40:01.499	2024-01-11 09:40:01.499	67a43120-6d2a-4cd5-8aa6-bf37e1986466	\N	\N	\N	\N
66	1	Tri	mitidevus@gmail.com	<p>123123</p>	{}	Panel	\N	1	NEW		2024-01-13 12:21:06.72	2024-01-13 12:21:06.72	6b002422-2fbe-4622-bce9-23ae31877a2f	\N	\N	\N	\N
46	3	Minh Tri	minhtri.do2410@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Location	22	\N	NEW		2024-01-11 09:40:01.499	2024-01-11 09:40:01.499	67a43120-6d2a-4cd5-8aa6-bf37e1986466	\N	\N	\N	\N
45	3	Tri Do	mitidevus@gmail.com	<p>Ở đ&acirc;y qu&aacute; tối</p>	{}	Panel	\N	34	NEW		2024-01-11 14:09:24.367	2024-01-11 14:09:24.367	1044f237-87b0-45b3-a68f-65fdc71544d3	\N	\N	\N	\N
47	1	Thong ano	thong.nguyen@gmail.com	test content	{}	Point	\N	\N	NEW		2024-01-12 16:59:06.257	2024-01-12 16:59:06.257	1234thong	\N	\N	\N	\N
48	1	Thong ano	thong.nguyen@gmail.com	test content	{}	Point	\N	\N	NEW		2024-01-12 16:59:40.624	2024-01-12 16:59:40.624	1234thong	123123123.000000000000000000000000000000	109239419.000000000000000000000000000000	\N	\N
49	1	Huy Nguyen	huy@gmail.com	<p>dfgdfg</p>	{}	Location	5	\N	NEW		2024-01-13 03:03:15.966	2024-01-13 03:03:15.966	b803747e-a96a-42f9-8412-11b90d95fff9	\N	\N	\N	\N
51	4	Huy Nguyen	huy123@gmail.com	<p>sao em đẹp thế</p>	{}	Location	1	\N	PENDING	Hehe	2024-01-13 05:12:37.974	2024-01-13 10:08:18.82	b803747e-a96a-42f9-8412-11b90d95fff9	\N	\N	\N	\N
67	1	TRi	mitidevus@gmail.com	<p>123123</p>	{}	Panel	\N	1	NEW		2024-01-13 12:21:39.137	2024-01-13 12:21:39.137	517e2f05-4b08-4ffd-9ce1-1e166550d066	\N	\N	\N	\N
68	1	Tri Do	mitidevus@gmail.com	<p><strong>Hello</strong></p>	{}	Panel	\N	1	NEW		2024-01-13 12:29:30.303	2024-01-13 12:29:30.303	d697977e-fc99-46e8-afb9-2b2c987ff0a1	\N	\N	\N	\N
50	1	Huy	huy@gmail.com	<p>dsfdsf</p>	{}	Location	1	\N	DONE	Done	2024-01-13 03:08:39.812	2024-01-13 10:30:00.075	b803747e-a96a-42f9-8412-11b90d95fff9	\N	\N	\N	\N
52	1	Tri Do	mitidevus@gmail.com	<p>Hahaha</p>	{}	Location	1	\N	NEW		2024-01-13 11:28:25.122	2024-01-13 11:28:25.122	ab9857d6-d81a-4d1a-9672-f7cf710d981e	\N	\N	\N	\N
53	1	Tri Do	mitidevus@gmail.com	<p>Hahaha</p>	{}	Location	1	\N	NEW		2024-01-13 11:44:18.315	2024-01-13 11:44:18.315	940fc86e-dfb0-47c3-81d2-d8be494412bf	\N	\N	\N	\N
54	1	Tri Do	minhtri.do2410@gmail.com	<p>Alibaba</p>	{}	Location	1	\N	NEW		2024-01-13 11:49:21.209	2024-01-13 11:49:21.209	91405d90-ecbf-48d5-9bec-945ae94cac0e	\N	\N	\N	\N
55	1	Tri Do	minhtri.do2410@gmail.com	<p>Alibaba</p>	{}	Location	1	\N	NEW		2024-01-13 11:59:52.168	2024-01-13 11:59:52.168	edcd91c8-8afd-4740-9178-673a324ed57a	\N	\N	\N	\N
56	1	Tri Do	minhtri.do2410@gmail.com	<p>Alibaba</p>	{}	Location	1	\N	NEW		2024-01-13 12:01:48.876	2024-01-13 12:01:48.876	df190a48-f201-472a-9546-ac2a9e7bec88	\N	\N	\N	\N
57	1	Tri Do	minhtri.do2410@gmail.com	<p>Alibaba</p>	{}	Location	1	\N	NEW		2024-01-13 12:03:58.802	2024-01-13 12:03:58.802	19822fdd-39ea-4bb1-91f2-d048b0eaf415	\N	\N	\N	\N
58	1	Tri Do	minhtri.do2410@gmail.com	<p>Alibaba</p>	{}	Location	1	\N	NEW		2024-01-13 12:05:32.105	2024-01-13 12:05:32.105	4b17c00a-d5ee-44f3-9fd7-1ae0782388a7	\N	\N	\N	\N
59	1	Tri Do	mitidevus@gmail.com	<p>1231232</p>	{}	Location	1	\N	NEW		2024-01-13 12:06:25.915	2024-01-13 12:06:25.915	32d72b84-7b23-4518-b199-f85af2d43417	\N	\N	\N	\N
60	1	Tri Do	minhtri.do2410@gmail.com	<p>123123</p>	{}	Panel	\N	1	NEW		2024-01-13 12:08:30.949	2024-01-13 12:08:30.949	857370e9-0152-462e-8946-7f5d88f823e0	\N	\N	\N	\N
76	2	Huy	huy@gmail.com	<p><strong>T&ocirc;i muốn tạo 1 bảng quảng c&aacute;o hợp l&iacute; hơn</strong></p>	{}	Location	3	\N	NEW		2024-01-14 04:08:42.875	2024-01-14 04:08:42.875	b803747e-a96a-42f9-8412-11b90d95fff9	\N	\N	\N	\N
71	1	Tri Do	mitidevus@gmail.com	<p>Haha</p>	{}	Location	1	\N	DONE	Done	2024-01-13 14:24:15.428	2024-01-13 14:28:32.317	61e5a59d-6fb1-4538-a9ce-377c6047628f	\N	\N	\N	\N
72	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Point	\N	\N	NEW		2024-01-14 02:59:14.294	2024-01-14 02:59:14.294	2412341234-asfasdfasdf	10.321000000000000000000000000000	10.145500000000000000000000000000	\N	\N
73	2	Huy	huy@gmail.com	<p>fdgdfg</p>	{}	Point	\N	\N	NEW		2024-01-14 03:30:16.578	2024-01-14 03:30:16.578	b803747e-a96a-42f9-8412-11b90d95fff9	10.852397810408140000000000000000	106.660442229113100000000000000000	\N	\N
69	1	Tri Do	minhtri.do2410@gmail.com	<p>Haha<strong> 123</strong>&nbsp;<em>456</em></p>	{}	Panel	\N	1	PENDING	Done	2024-01-13 12:30:24.777	2024-01-13 14:22:31.15	77d48c4b-5b18-479b-8f99-9f87f2206eaf	\N	\N	\N	\N
70	1	Huy Nguyen	huy@gmail.com	<p>abc 123</p>	{}	Panel	\N	3	NEW		2024-01-13 14:23:12.107	2024-01-13 14:23:12.107	b803747e-a96a-42f9-8412-11b90d95fff9	\N	\N	\N	\N
74	1	Huy	huy@gmail.com	<p>dsfdsfsdf</p>	{}	Point	\N	\N	NEW		2024-01-14 03:32:40.06	2024-01-14 03:32:40.06	b803747e-a96a-42f9-8412-11b90d95fff9	0.000000000000000000000000000000	106.657791777774300000000000000000	\N	\N
75	3	Huy	huy@gmail.com	<p>sadsadasdasd</p>	{}	Point	\N	\N	NEW		2024-01-14 03:38:52.719	2024-01-14 03:38:52.719	b803747e-a96a-42f9-8412-11b90d95fff9	10.850246863675750000000000000000	106.660532359798100000000000000000	\N	\N
77	1	Huy	huy@gmail.com	<p><em>Chợ c&oacute; tội phạm</em></p>	{}	Point	\N	\N	NEW		2024-01-14 04:11:53.204	2024-01-14 04:11:53.204	b803747e-a96a-42f9-8412-11b90d95fff9	10.835757956489080000000000000000	106.658578965604900000000000000000	\N	\N
78	1	Tri Do	mitidevus@gmail.com	<p>ABC123</p>	{}	Location	21	\N	NEW		2024-01-14 04:59:38.415	2024-01-14 04:59:38.415	4883fc45-7530-45af-b26d-2e289a520b64	\N	\N	\N	\N
79	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Point	\N	\N	NEW		2024-01-14 05:20:16.276	2024-01-14 05:20:16.276	2412341234-asfasdfasdf	10.835757956489080000000000000000	106.658578965604900000000000000000	\N	\N
80	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Point	\N	\N	NEW		2024-01-14 05:21:55.561	2024-01-14 05:21:55.561	2412341234-asfasdfasdf	10.835757956489080000000000000000	106.658578965604900000000000000000	\N	\N
81	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Point	\N	\N	NEW		2024-01-14 05:22:45.945	2024-01-14 05:22:45.945	2412341234-asfasdfasdf	10.835757956489080000000000000000	106.658578965604900000000000000000	\N	\N
82	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Point	\N	\N	NEW		2024-01-14 05:24:18.736	2024-01-14 05:24:18.736	2412341234-asfasdfasdf	10.835757956489080000000000000000	106.658578965604900000000000000000	\N	\N
83	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Point	\N	\N	NEW		2024-01-14 05:32:16.737	2024-01-14 05:32:16.737	2412341234-asfasdfasdf	10.835757956489080000000000000000	106.658578965604900000000000000000	\N	\N
84	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Point	\N	\N	NEW		2024-01-14 05:37:27.164	2024-01-14 05:37:27.164	2412341234-asfasdfasdf	10.843271000000000000000000000000	106.566813000000000000000000000000	\N	\N
86	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Point	\N	\N	NEW		2024-01-14 06:06:24.374	2024-01-14 06:06:24.374	2412341234-asfasdfasdf	10.852397810408140000000000000000	106.660442229113100000000000000000	6	89
87	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Point	\N	\N	NEW		2024-01-14 06:15:48.186	2024-01-14 06:15:48.186	2412341234-asfasdfasdf	10.852397810408140000000000000000	106.660442229113100000000000000000	6	89
85	1	Thong	adfas@gmail.com	<p>Biển quảng cáo này quá xấu lần 4</p>	{}	Point	\N	\N	NEW		2024-01-14 05:40:28.805	2024-01-14 05:40:28.805	2412341234-asfasdfasdf	10.852397810408140000000000000000	106.660442229113100000000000000000	6	89
\.


--
-- TOC entry 2679 (class 0 OID 163959)
-- Dependencies: 233
-- Data for Name: report_type; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.report_type (id, name) FROM stdin;
1	Tố giác sai phạm
2	Đăng ký nội dung
3	Đóng góp ý kiến
4	Giải đáp thắc mắc
\.


--
-- TOC entry 2681 (class 0 OID 163966)
-- Dependencies: 235
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."user" (id, email, password, first_name, last_name, phone_number, dob, reset_password, created_at, updated_at, ward_id, district_id, role, refresh_token) FROM stdin;
6	chihien2002711@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$WhpyrboPp/8TWTPx/2xbPg$EuePE5yrUB2GCwu3DqwxsrwZxa3Egk9SHtTcrXjQt5o	Hien	Truong	\N	\N	f	2024-01-01 02:14:11.86	2024-01-13 13:15:57.981	12	\N	ward_officer	$argon2id$v=19$m=65536,t=3,p=4$o/CvFNEIfWX5uZRYqBFAEQ$W88GR+Uqk8CS4BIJXN8yVQO6eq4snaL0mYqecMlv1No
2	officerw1@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$z8zLkxHvWXINjrzV0z2mDg$WvDUvJHilmbe0We7X88e12OZGMyf3hzSXC7ohp2MIx0	Tri	Do	\N	\N	f	2023-12-30 07:33:08.538	2024-01-14 09:27:17.838	1	\N	ward_officer	$argon2id$v=19$m=65536,t=3,p=4$+lYyTXc5gx/DT/k1//+G8Q$fDRuPKBbdC91CXnwh2t0CWw3I/KT4st7bDKq9xSTYz8
11	officerw2@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$bdlyRmdDIKvcgt+rYqhG/w$rD/lI1mbAjBX/d6p7wmin7gl5EapHZ+jKU/b+20we1c	Tri	Do	\N	\N	f	2024-01-02 15:19:45.638	2024-01-10 12:27:11.22	2	\N	ward_officer	$argon2id$v=19$m=65536,t=3,p=4$2smW0Q9UXDV/XfnOgkWSOQ$KsfT4oVTerndsZyqQWJJqxeH1mD3b0RuKSmsZgPDyaw
8	chihien200225@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$UTVG68cxu61Pru4sUh2cbA$z6URbDngNR2KEreTdxRxgN8mzlIJN+t+k68koRNogF4	Hien	Truong	\N	\N	f	2024-01-02 01:08:32.885	2024-01-02 01:08:32.885	\N	1	district_officer	\N
16	p2q6@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$NAZdRFWIdLlnK2b9B33c3A$0dB266Dsxzl1NHi10bCJQbLqqlXf31tDVTG9XQL+rf0	Tri	Do	\N	\N	f	2024-01-10 13:03:34.002	2024-01-11 15:26:16.308	266	\N	ward_officer	\N
22	test@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$7eWTojeBZfImYscquI1vag$Z5aebJrk8Yj8VkJs0Q7sKV9ha9+zd4dfrnDiZW2vQT8	test	ter	\N	\N	f	2024-01-14 04:11:02.479	2024-01-14 04:11:02.479	\N	\N	cdo	\N
10	chihien20022@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$QhiNdEaWhuvtnmZHeu64Bw$F/VLYaADN6k9XMXicnQyjpHsUAk34wpK7oPV1X6yI7I	Hien	Truong	0795907075	\N	f	2024-01-02 08:58:19.081	2024-01-13 06:10:08.883	1	\N	ward_officer	$argon2id$v=19$m=65536,t=3,p=4$kJd9hygfNEhf58s5xKBpSw$UWLZVpLtONqV7DiY48xKo41kRnOvZdGYWrvNczk1h0g
20	chihien20024@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$Z0rnrNh12NBRPdntlQG66Q$JELKXmed9Lbz5F+XPv0hC6eji1HWBA5sP/CL8eQm+lg	Hien	Truong	\N	\N	f	2024-01-13 05:54:59.259	2024-01-14 08:56:56.972	2	\N	ward_officer	$argon2id$v=19$m=65536,t=3,p=4$dp6/425oGiNlnKfHsCCb0w$FRbr8gRJW62f19TbLAuOVTmqM4b9uRccdxdzy8gr4TI
7	chihien20025@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$fytIg6W9uXnT/7RknMRTPg$a6pl6yXSg03PsC1B9rId/0mymKP5y6IVOb0X/x7gEM8	Hien	Truong	\N	\N	f	2024-01-02 01:05:54.659	2024-01-02 01:17:29.011	\N	1	district_officer	$argon2id$v=19$m=65536,t=3,p=4$XGJ67Dv+KtXNwSaqwkZWQA$wHnvERSsFutrvJGjd+5eJqOCXMsxXl5vhKXBLtCu4C4
23	testdistrict@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$YCBfje10AAnIUKqX4+b+2g$55B9WcCXBJt5/Bwlp0/kS9/pdJAjrF9OLD3FZanCn5s	some	one	\N	\N	f	2024-01-14 04:14:40.815	2024-01-14 04:14:40.815	\N	1	district_officer	\N
3	huy@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$voXkLjmP3RnXdqjOIiWh5w$7/+6OIZiQtIXPfK42uG90K3eu+WbwuzEVjcADa5ITfY	Huy	Nguyen	\N	\N	f	2023-12-30 13:13:28.4	2024-01-05 07:21:46.732	1	\N	ward_officer	\N
15	p6q6@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$x/02/DC5JtYdPomwTLFUSg$WuY/WHmlD7vMuwlBaoL5eLaOOz5jrXTcXLPNexQgci8	Tri	Do	\N	\N	f	2024-01-10 12:54:06.777	2024-01-11 15:38:57.21	262	\N	ward_officer	\N
1	cdo@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$66H3HxjahfGcZfUB3//GWQ$v4Q92b7+JmwDFRPOeNELyIrGnDRchPcEP6xn7yRL5eg	Tri	Do	0795907075	2002-04-15 00:00:00	f	2023-12-30 06:05:35.204	2024-01-14 06:52:31.296	\N	\N	cdo	$argon2id$v=19$m=65536,t=3,p=4$NWK88RFPJNQOWrfwjgJ1Uw$x+InJ71QVaCByszfX8Bl8SUWfZ92wdWWvfaDCFCgPGs
19	chihien20023@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$58ISFBGDZBTW5nT57bB5UQ$fMnieAvTjMLjzxNcZ9BcVEDWfIwdxmjVj2ZG/8pxEDY	Hien	Truong	\N	\N	f	2024-01-12 07:00:01.929	2024-01-14 08:57:06.992	\N	\N	cdo	$argon2id$v=19$m=65536,t=3,p=4$gYfWLMyN7Cm4WHUPeQjMSw$8ZucJ4tbVLJ0MtDS/77l6FInzPAi2z8mj8maJbIximg
13	officerd1@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$MLehI8tXXVcSZjD77PRsGw$f7WQ7rUQDor6YpgBy7BvdjsbFoB8Qq01vposGuQ38/I	Tri	Do	\N	\N	f	2024-01-10 11:45:52.801	2024-01-10 12:12:09.598	\N	1	district_officer	$argon2id$v=19$m=65536,t=3,p=4$N4xipGzs3hRPGmxC8Eakog$5g29U7SaSZUt6JbAI8drbLbzhho6YE4XIsRY/kldgiw
9	chihien2002@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$OCKd+qDo8N6ehyO3z1EJew$Q2PS9aakjaYy9UJ7xrcneWu3wf09wFObmMbLTqcny7c	Hien	Truong	\N	\N	f	2024-01-02 01:16:05.888	2024-01-10 12:18:40.62	\N	1	district_officer	$argon2id$v=19$m=65536,t=3,p=4$143OPvy3xiQmtUzgiiiyXA$/rHAoRten7ORjsicaeteFkkAzWeSr1rTtOhzq1jo8lA
17	q6@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$XIttKVLyLIEdjkM/kL6vtQ$F0kkTzOOtHFnR48Om0+NNAi2y/ykajnNo5ezNeC4/x8	Tri	Do	\N	\N	f	2024-01-10 13:14:29.905	2024-01-13 09:49:49.952	\N	18	district_officer	$argon2id$v=19$m=65536,t=3,p=4$4Z5v7/oAn8B2EPv+YTx2NA$N6kcNLLs5roN96mDbEAGpAKqDGuOcEoPVoHkH+BAF60
5	chihien200271@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$XNvqpjQ4hByM58OoPSl+8Q$KoHaCd58ie5wleLYnYeHQfk9u4KmrCe31cEo+AAXrIw	Hien	Truong	\N	\N	f	2024-01-01 01:45:33.386	2024-01-14 06:10:25.619	\N	\N	cdo	$argon2id$v=19$m=65536,t=3,p=4$DGuHbCfMNcu7ALduwrGvqw$HGHNGVMWDdSYm9FkYJR7uBsIxnXMkvn6CC5NXNnhDCw
4	shincoder.forwork@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$CaBoFLLHk4Jg1JFOUE6k2Q$xe/LYpMY8cNQStjiEYNDifsig2lyIoPBwPQ+FVuKrm8	Kiet	Tran	\N	\N	f	2023-12-31 16:59:34.137	2024-01-14 09:18:18.075	\N	\N	cdo	\N
12	chihien20027111@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$JEiPZIZn478V9sFL+Uutbg$yENLZIpBjovtiSHgY+OsAl/1XTzmePu/jVPbGAJn4Wc	Hien	Truong	\N	\N	f	2024-01-09 10:42:41.339	2024-01-13 13:15:05.05	\N	12	district_officer	$argon2id$v=19$m=65536,t=3,p=4$c6+oHoqD7JjTBd4FgZJiuA$2WcqaISXEnN93G7yfSddzlLxzVdvBmVsoULbIl/pAdc
24	testward@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$oUScH5Z/Zi/w/VbL2XhSag$+45tI2ZB5GFgr5Ys+A88Zjf9yqRQ5PCbwdRFyZiX+8s	some12	one12		2024-01-20 17:00:00	f	2024-01-14 04:16:16.305	2024-01-14 05:45:23.146	101	\N	ward_officer	\N
21	mitidevus@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$kfdx0GQT32xQK3BZb7B67g$Yd88/QgpViED/ooWekg3aYUVbYuls/D9sopgsboPg1g	Tri	Do	\N	\N	f	2024-01-13 14:59:45.52	2024-01-13 15:07:52.014	263	\N	ward_officer	\N
25	chihien2002711111@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$akMWEo6rYI5Le9TTHQLA/g$QqfUOCgXxz5hGpmmo05R5r788wYkZV8zCWj4aLDMasQ	Hien	Truong	\N	\N	f	2024-01-14 06:12:04.159	2024-01-14 06:32:57.725	89	\N	ward_officer	$argon2id$v=19$m=65536,t=3,p=4$i1v+NqwH/pFYWV3zOG3OeA$C/+qx65c+Ttbl1eg7s2m9xOkAHvR1KBjTA4KOZ6mKpU
18	p5q6-1@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$6JNaBFHLAJWIpfAcDK7NoA$AtyokqiUChgS7FcvQ7D62fHaquu3ZpOq0coaYpZXAFQ	Hien	Truong	\N	\N	f	2024-01-11 15:49:22.068	2024-01-14 08:57:19.055	2	\N	ward_officer	$argon2id$v=19$m=65536,t=3,p=4$DqEheK5kFvD0FUIFzA0dTw$OwiPCJGMNknLJ4/cipHpWrt7vR9MaAZGmPYR4dfDSyU
26	officerd6@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$B5dZm7ZQmlfL6b4OYAXmrw$vRh4KtAMhnfcPL0D4bcrJqcARPVznES6TiwRgMbFz4E	Tri	Do	\N	\N	f	2024-01-14 06:53:20.578	2024-01-14 08:42:22.82	\N	6	district_officer	\N
14	p5q6@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$yc5HAQ5cvttCmuYoMfAjgw$trHOwS4+nMs6QsxSKx5Fo2ba66LZAVWjgkxyHAt6yZA	Tri	Do	\N	\N	f	2024-01-10 12:29:49.605	2024-01-14 09:18:30.413	263	\N	ward_officer	$argon2id$v=19$m=65536,t=3,p=4$dNsEU0FOVvNXj46R5Gj2JA$MJjpfDgPT6fiLkqL+xA62KMUcoyOu72CSchWLcdnbS4
\.


--
-- TOC entry 2673 (class 0 OID 163929)
-- Dependencies: 227
-- Data for Name: ward; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.ward (id, name, district_id) FROM stdin;
1	Phường An Khánh	1
2	Phường Bình Trưng Tây	1
3	Phường Bình Trưng Đông	1
4	Phường An Phú	1
5	Phường Thảo Điền	1
6	Phường Phú Hữu	1
7	Phường Phước Bình	1
8	Phường Long Trường	1
9	Phường Long Phước	1
10	Phường Trường Thạnh	1
11	Phường Phước Long B	1
12	Phường Phước Long A	1
13	Phường Tăng Nhơn Phú B	1
14	Phường Tăng Nhơn Phú A	1
15	Phường Hiệp Phú	1
16	Phường Tân Phú	1
17	Phường Long Thạnh Mỹ	1
18	Phường Long Bình	1
19	Phường Thủ Thiêm	1
20	Phường An Lợi Đông	1
21	Phường Thạnh Mỹ Lợi	1
22	Phường Cát Lái	1
23	Phường Trường Thọ	1
24	Phường Bình Thọ	1
25	Phường Linh Đông	1
26	Phường Linh Tây	1
27	Phường Linh Chiểu	1
28	Phường Hiệp Bình Chánh	1
29	Phường Hiệp Bình Phước	1
30	Phường Tam Phú	1
31	Phường Tam Bình	1
32	Phường Linh Trung	1
33	Phường Bình Chiểu	1
34	Phường Linh Xuân	1
35	Xã Thạnh An	2
36	Xã Tam Thôn Hiệp	2
37	Xã Lý Nhơn	2
38	Xã Long Hòa	2
39	Xã Bình Khánh	2
40	Xã An Thới Đông	2
41	Thị trấn Cần Thạnh	2
42	Xã Phước Lộc	3
43	Xã Phước Kiển	3
44	Xã Phú Xuân	3
45	Xã Nhơn Đức	3
46	Xã Long Thới	3
47	Xã Hiệp Phước	3
48	Thị trấn Nhà Bè	3
49	Xã Vĩnh Lộc B	4
50	Xã Vĩnh Lộc A	4
51	Xã Tân Quý Tây	4
52	Xã Tân Nhựt	4
53	Xã Tân Kiên	4
54	Xã Quy Đức	4
55	Xã Phong Phú	4
56	Xã Phạm Văn Hai	4
57	Xã Lê Minh Xuân	4
58	Xã Hưng Long	4
59	Xã Đa Phước	4
60	Xã Bình Lợi	4
61	Xã Bình Hưng	4
62	Xã Bình Chánh	4
63	Xã An Phú Tây	4
64	Thị trấn Tân Túc	4
65	Phường 28	5
66	Phường 27	5
67	Phường 26	5
68	Phường 25	5
69	Phường 24	5
70	Phường 22	5
71	Phường 21	5
72	Phường 19	5
73	Phường 17	5
74	Phường 15	5
75	Phường 14	5
76	Phường 13	5
77	Phường 12	5
78	Phường 11	5
79	Phường 7	5
80	Phường 6	5
81	Phường 5	5
82	Phường 3	5
83	Phường 2	5
84	Phường 1	5
85	Phường 9	6
86	Phường 8	6
87	Phường 6	6
88	Phường 17	6
89	Phường 16	6
90	Phường 15	6
91	Phường 14	6
92	Phường 13	6
93	Phường 12	6
94	Phường 11	6
95	Phường 10	6
96	Phường 7	6
97	Phường 5	6
98	Phường 4	6
99	Phường 3	6
100	Phường 1	6
101	Xã Trung Lập Thượng	7
102	Xã Trung Lập Hạ	7
103	Xã Trung An	7
104	Xã Thái Mỹ	7
105	Xã Tân Thông Hội	7
106	Xã Tân Thạnh Tây	7
107	Xã Tân Thạnh Đông	7
108	Xã Tân Phú Trung	7
109	Xã Tân An Hội	7
110	Xã Phước Vĩnh An	7
111	Xã Phước Thạnh	7
112	Xã Phước Hiệp	7
113	Xã Phú Mỹ Hưng	7
114	Xã Phú Hòa Đông	7
115	Xã Phạm Văn Cội	7
116	Xã Nhuận Đức	7
117	Xã Hòa Phú	7
118	Xã Bình Mỹ	7
119	Xã An Phú	7
120	Xã An Nhơn Tây	7
121	Thị trấn Củ Chi	7
122	Xã Xuân Thới Thượng	8
123	Xã Xuân Thới Sơn	8
124	Xã Xuân Thới Đông	8
125	Xã Trung Chánh	8
126	Xã Thới Tam Thôn	8
127	Xã Tân Xuân	8
128	Xã Tân Thới Nhì	8
129	Xã Tân Hiệp	8
130	Xã Nhị Bình	8
131	Xã Đông Thạnh	8
132	Xã Bà Điểm	8
133	Thị trấn Hóc Môn	8
134	Phường Tân Tạo A	9
135	Phường Tân Tạo	9
136	Phường Bình Trị Đông B	9
137	Phường Bình Trị Đông A	9
138	Phường Bình Trị Đông	9
139	Phường Bình Hưng Hoà B	9
140	Phường Bình Hưng Hoà A	9
141	Phường Bình Hưng Hòa	9
142	Phường An Lạc A	9
143	Phường  An Lạc	9
144	Phường 17	10
145	Phường 15	10
146	Phường 14	10
147	Phường 13	10
148	Phường 12	10
149	Phường 11	10
150	Phường 10	10
151	Phường 9	10
152	Phường 8	10
153	Phường 7	10
154	Phường 5	10
155	Phường 4	10
156	Phường 3	10
157	Phường 2	10
158	Phường 1	10
159	Phường Tây Thạnh	11
160	Phường Tân Thới Hòa	11
161	Phường Tân Thành	11
162	Phường Tân Sơn Nhì	11
163	Phường Tân Quý	11
164	Phường Sơn Kỳ	11
165	Phường Phú Trung	11
166	Phường Phú Thọ Hòa	11
167	Phường Phú Thạnh	11
168	Phường Hòa Thạnh	11
169	Phường Hiệp Tân	11
170	Phường 15	12
171	Phường 14	12
172	Phường 13	12
173	Phường 12	12
174	Phường 11	12
175	Phường 10	12
176	Phường 9	12
177	Phường 8	12
178	Phường 7	12
179	Phường 6	12
180	Phường 5	12
181	Phường 4	12
182	Phường 3	12
183	Phường 2	12
184	Phường 1	12
185	Phường Trung Mỹ Tây	13
186	Phường Thới An	13
187	Phường Thạnh Xuân	13
188	Phường Thạnh Lộc	13
189	Phường Tân Thới Nhất	13
190	Phường Tân Thới Hiệp	13
191	Phường Tân Hưng Thuận	13
192	Phường Tân Chánh Hiệp	13
193	Phường Hiệp Thành	13
194	Phường Đông Hưng Thuận	13
195	Phường An Phú Đông	13
196	Phường test 2	14
197	Phường 16	14
198	Phường 15	14
199	Phường 14	14
200	Phường 13	14
201	Phường 12	14
202	Phường 11	14
203	Phường 10	14
204	Phường 9	14
205	Phường 8	14
206	Phường 7	14
207	Phường 6	14
208	Phường 5	14
209	Phường 4	14
210	Phường 3	14
211	Phường 2	14
212	Phường 1	14
213	Phường 15	15
214	Phường 14	15
215	Phường 13	15
216	Phường 12	15
217	Phường 11	15
218	Phường 10	15
219	Phường 9	15
220	Phường 8	15
221	Phường 7	15
222	Phường 6	15
223	Phường 5	15
224	Phường 4	15
225	Phường 3	15
226	Phường 2	15
227	Phường 1	15
228	Phường 16	16
229	Phường 15	16
230	Phường 14	16
231	Phường 13	16
232	Phường 12	16
233	Phường 11	16
234	Phường 10	16
235	Phường 9	16
236	Phường 8	16
237	Phường 7	16
238	Phường 6	16
239	Phường 5	16
240	Phường 4	16
241	Phường 3	16
242	Phường 2	16
243	Phường 1	16
244	Phường Tân Thuận Tây	17
245	Phường Tân Thuận Đông	17
246	Phường Tân Quy	17
247	Phường Tân Phú	17
248	Phường Tân Phong	17
249	Phường Tân Kiểng	17
250	Phường Tân Hưng	17
251	Phường Phú Thuận	17
252	Phường Phú Mỹ	17
253	Phường Bình Thuận	17
254	Phường 14	18
255	Phường 13	18
256	Phường 12	18
257	Phường 11	18
258	Phường 10	18
259	Phường 9	18
260	Phường 8	18
261	Phường 7	18
262	Phường 6	18
263	Phường 5	18
264	Phường 4	18
265	Phường 3	18
266	Phường 2	18
267	Phường 1	18
268	Phường 15	19
269	Phường 14	19
270	Phường 13	19
271	Phường 12	19
272	Phường 11	19
273	Phường 10	19
274	Phường 9	19
275	Phường 8	19
276	Phường 7	19
277	Phường 6	19
278	Phường 5	19
279	Phường 4	19
280	Phường 3	19
281	Phường 2	19
282	Phường 1	19
283	Phường 18	20
284	Phường 16	20
285	Phường 15	20
286	Phường 14	20
287	Phường 13	20
288	Phường 12	20
289	Phường 10	20
290	Phường 9	20
291	Phường 8	20
292	Phường 6	20
293	Phường 5	20
294	Phường 4	20
295	Phường 3	20
296	Phường 2	20
297	Phường 1	20
298	Võ Thị Sáu	21
299	Phường 14	21
300	Phường 13	21
301	Phường 12	21
302	Phường 11	21
303	Phường 10	21
304	Phường 9	21
305	Phường 8	21
306	Phường 7	21
307	Phường 6	21
308	Phường 5	21
309	Phường 4	21
310	Phường 3	21
311	Phường 2	21
312	Phường 1	21
313	Phường Tân Định	22
314	Phường Phạm Ngũ Lão	22
315	Phường Nguyễn Thái Bình	22
316	Phường Nguyễn Cư Trinh	22
317	Phường Đa Kao	22
318	Phường Cô Giang	22
319	Phường Cầu Ông Lãnh	22
320	Phường Cầu Kho	22
321	Phường Bến Thành	22
322	Phường Bến Nghé	22
\.


--
-- TOC entry 2700 (class 0 OID 0)
-- Dependencies: 228
-- Name: ads_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.ads_request_id_seq', 47, true);


--
-- TOC entry 2701 (class 0 OID 0)
-- Dependencies: 222
-- Name: advertisement_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.advertisement_type_id_seq', 1, false);


--
-- TOC entry 2702 (class 0 OID 0)
-- Dependencies: 224
-- Name: district_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.district_id_seq', 22, true);


--
-- TOC entry 2703 (class 0 OID 0)
-- Dependencies: 218
-- Name: location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.location_id_seq', 38, true);


--
-- TOC entry 2704 (class 0 OID 0)
-- Dependencies: 220
-- Name: location_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.location_type_id_seq', 1, false);


--
-- TOC entry 2705 (class 0 OID 0)
-- Dependencies: 214
-- Name: panel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.panel_id_seq', 44, true);


--
-- TOC entry 2706 (class 0 OID 0)
-- Dependencies: 216
-- Name: panel_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.panel_type_id_seq', 1, false);


--
-- TOC entry 2707 (class 0 OID 0)
-- Dependencies: 230
-- Name: report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.report_id_seq', 87, true);


--
-- TOC entry 2708 (class 0 OID 0)
-- Dependencies: 232
-- Name: report_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.report_type_id_seq', 1, false);


--
-- TOC entry 2709 (class 0 OID 0)
-- Dependencies: 234
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.user_id_seq', 26, true);


--
-- TOC entry 2710 (class 0 OID 0)
-- Dependencies: 226
-- Name: ward_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.ward_id_seq', 322, true);


--
-- TOC entry 2491 (class 2606 OID 163947)
-- Name: ads_request ads_request_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ads_request
    ADD CONSTRAINT ads_request_pkey PRIMARY KEY (id);


--
-- TOC entry 2485 (class 2606 OID 163918)
-- Name: advertisement_type advertisement_type_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.advertisement_type
    ADD CONSTRAINT advertisement_type_pkey PRIMARY KEY (id);


--
-- TOC entry 2487 (class 2606 OID 163927)
-- Name: district district_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.district
    ADD CONSTRAINT district_pkey PRIMARY KEY (id);


--
-- TOC entry 2481 (class 2606 OID 163900)
-- Name: location location_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_pkey PRIMARY KEY (id);


--
-- TOC entry 2483 (class 2606 OID 163909)
-- Name: location_type location_type_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.location_type
    ADD CONSTRAINT location_type_pkey PRIMARY KEY (id);


--
-- TOC entry 2477 (class 2606 OID 163879)
-- Name: panel panel_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.panel
    ADD CONSTRAINT panel_pkey PRIMARY KEY (id);


--
-- TOC entry 2479 (class 2606 OID 163888)
-- Name: panel_type panel_type_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.panel_type
    ADD CONSTRAINT panel_type_pkey PRIMARY KEY (id);


--
-- TOC entry 2493 (class 2606 OID 163957)
-- Name: report report_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_pkey PRIMARY KEY (id);


--
-- TOC entry 2495 (class 2606 OID 163964)
-- Name: report_type report_type_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report_type
    ADD CONSTRAINT report_type_pkey PRIMARY KEY (id);


--
-- TOC entry 2498 (class 2606 OID 163977)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 2489 (class 2606 OID 163936)
-- Name: ward ward_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ward
    ADD CONSTRAINT ward_pkey PRIMARY KEY (id);


--
-- TOC entry 2496 (class 1259 OID 163986)
-- Name: user_email_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);


--
-- TOC entry 2508 (class 2606 OID 164032)
-- Name: ads_request fk_ads_request_location; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ads_request
    ADD CONSTRAINT fk_ads_request_location FOREIGN KEY (location_id) REFERENCES public.location(id) ON DELETE CASCADE;


--
-- TOC entry 2509 (class 2606 OID 164037)
-- Name: ads_request fk_ads_request_panel; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ads_request
    ADD CONSTRAINT fk_ads_request_panel FOREIGN KEY (panel_id) REFERENCES public.panel(id) ON DELETE CASCADE;


--
-- TOC entry 2510 (class 2606 OID 164042)
-- Name: ads_request fk_ads_request_user; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ads_request
    ADD CONSTRAINT fk_ads_request_user FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 2511 (class 2606 OID 180224)
-- Name: report fk_report_district; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT fk_report_district FOREIGN KEY (district_id) REFERENCES public.district(id);


--
-- TOC entry 2512 (class 2606 OID 164047)
-- Name: report fk_report_location; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT fk_report_location FOREIGN KEY (location_id) REFERENCES public.location(id) ON DELETE CASCADE;


--
-- TOC entry 2513 (class 2606 OID 164052)
-- Name: report fk_report_panel; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT fk_report_panel FOREIGN KEY (panel_id) REFERENCES public.panel(id) ON DELETE CASCADE;


--
-- TOC entry 2514 (class 2606 OID 164057)
-- Name: report fk_report_reporttype; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT fk_report_reporttype FOREIGN KEY (type_id) REFERENCES public.report_type(id) ON DELETE CASCADE;


--
-- TOC entry 2515 (class 2606 OID 180229)
-- Name: report fk_report_ward; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT fk_report_ward FOREIGN KEY (ward_id) REFERENCES public.ward(id);


--
-- TOC entry 2502 (class 2606 OID 164002)
-- Name: location location_ad_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_ad_type_id_fkey FOREIGN KEY (ad_type_id) REFERENCES public.advertisement_type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2503 (class 2606 OID 164007)
-- Name: location location_belong_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_belong_location_id_fkey FOREIGN KEY (belong_location_id) REFERENCES public.location(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2504 (class 2606 OID 164012)
-- Name: location location_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.district(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2505 (class 2606 OID 164017)
-- Name: location location_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.location_type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2506 (class 2606 OID 164022)
-- Name: location location_ward_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_ward_id_fkey FOREIGN KEY (ward_id) REFERENCES public.ward(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2499 (class 2606 OID 163987)
-- Name: panel panel_belong_panel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.panel
    ADD CONSTRAINT panel_belong_panel_id_fkey FOREIGN KEY (belong_panel_id) REFERENCES public.panel(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2500 (class 2606 OID 163992)
-- Name: panel panel_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.panel
    ADD CONSTRAINT panel_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2501 (class 2606 OID 163997)
-- Name: panel panel_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.panel
    ADD CONSTRAINT panel_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.panel_type(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2516 (class 2606 OID 164067)
-- Name: user user_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.district(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2517 (class 2606 OID 164062)
-- Name: user user_ward_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_ward_id_fkey FOREIGN KEY (ward_id) REFERENCES public.ward(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2507 (class 2606 OID 164027)
-- Name: ward ward_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ward
    ADD CONSTRAINT ward_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.district(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2688 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: admin
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2024-01-14 16:29:11 +07

--
-- PostgreSQL database dump complete
--

