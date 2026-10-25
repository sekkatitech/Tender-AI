-- =============================================================================
-- TenderPilot AI — hackathon demo data
-- =============================================================================
-- Turns ONE existing account's company into "Demo Company" and fills it with
-- tenders taken from four real South African tender documents:
--   * Johannesburg Water RFQJW039NS26-27 — 30 x 23.8" monitors
--   * Abaqulusi Municipality 8/2/1/628   — 75" interactive touch screen
--   * Abaqulusi Municipality 8/2/1/627   — laptop computers
--   * IDT "Employee's laptops" RFQ       — 19 x HP ProBook 4 G1i
--
-- Each tender appears twice: the original (closed, dates as advertised in
-- July/August 2026) and a re-issue with dates relative to the day you run
-- this script, so the dashboard always shows live countdowns, briefing
-- sessions and reminders. Re-run it the morning of the judging.
--
-- HOW TO RUN
--   1. Sign up in the web app with the judge account (e.g. demo@...).
--   2. Supabase dashboard → SQL Editor → paste this file.
--   3. Change v_email below to that account's email, then Run.
--
-- WARNING: this DELETES every tender, supplier and notification belonging
-- to that account's company before re-seeding. Only run it on the demo
-- account, never on a real customer's account.
-- =============================================================================

do $$
declare
  v_email   text := 'CHANGE-ME@example.com';   -- ← the judge account's email (never your real account)
  v_user    uuid;
  v_company uuid;
  v_today   date := (now() at time zone 'Africa/Johannesburg')::date;
  tz        text := 'Africa/Johannesburg';

  t_jw_old  uuid; t_jw   uuid;
  t_ts_old  uuid; t_ts   uuid;
  t_lp_old  uuid; t_lp   uuid;
  t_idt_old uuid; t_idt  uuid;
  s_ict     uuid; s_av   uuid; s_hp uuid;
begin
  select id into v_user from auth.users where email = v_email;
  if v_user is null then
    raise exception 'No account with email %. Sign up in the app first.', v_email;
  end if;
  select company_id into v_company from public.profiles where id = v_user;

  update public.companies
     set name = 'Demo Company', subscription_tier = 'professional'
   where id = v_company;
  update public.profiles
     set full_name = coalesce(full_name, 'Hackathon Judge'), role = 'owner'
   where id = v_user;

  -- Clean slate (child rows cascade from tenders / suppliers).
  delete from public.notifications where company_id = v_company;
  delete from public.tenders       where company_id = v_company;
  delete from public.suppliers     where company_id = v_company;

  -- ---------------------------------------------------------------- suppliers
  insert into public.suppliers (company_id, name, credit_terms, lead_time_days, performance_rating, notes)
  values (v_company, 'Ubuntu ICT Distributors (demo)', '30 days', 5, 4.6,
          'Monitors, laptops, HP Care Packs. Fictitious supplier for the demo.')
  returning id into s_ict;
  insert into public.suppliers (company_id, name, credit_terms, lead_time_days, performance_rating, notes)
  values (v_company, 'Zululand AV & Smart Boards (demo)', 'COD', 10, 4.2,
          'Interactive displays, wall mounts, AV installation in northern KZN. Fictitious supplier.')
  returning id into s_av;
  insert into public.suppliers (company_id, name, credit_terms, lead_time_days, performance_rating, notes)
  values (v_company, 'Gauteng Notebook Wholesale (demo)', '30 days', 7, 3.9,
          'Second quote source for HP ProBook. Fictitious supplier.')
  returning id into s_hp;

  -- ======================================================= 1. JOHANNESBURG WATER
  -- Original: closed 29 Jul 2026 16:00 — WON
  insert into public.tenders (company_id, tender_number, title, client, department,
    closing_date, briefing_date, is_briefing_compulsory, submission_method, status,
    evaluation_method, preference_points, warranty_requirements, risks, recommendations, created_by)
  values (v_company, 'RFQJW039NS26-27', 'Supply and delivery of 30 x 23.8" LCD HD LED monitors',
    'Johannesburg Water SOC Ltd', 'Supply Chain Management',
    (date '2026-07-29' + time '16:00') at time zone tz, null, false,
    'eTender portal (etenders.gov.za) using CSD login', 'won',
    '80/20 PPPFA 2022 — 80 price, 20 specific goals', 'SMME (EME/QSE) 51%+ black-owned',
    'Not specified — quote standard manufacturer warranty',
    'Quote must include ALL taxes or it is disqualified. Quote on letterhead, PDF only (no Word/Excel/pictures). Brand names required.',
    'Won at R93,037.88 incl. VAT. Keep this BOQ as the template for monitor RFQs.', v_user)
  returning id into t_jw_old;

  -- Re-issue: closes in 4 days
  insert into public.tenders (company_id, tender_number, title, client, department,
    closing_date, briefing_date, is_briefing_compulsory, submission_method, status,
    evaluation_method, preference_points, warranty_requirements, risks, questions, recommendations, created_by)
  values (v_company, 'RFQJW039NS26-27 (re-issue)', 'Supply and delivery of 30 x 23.8" LCD HD LED monitors',
    'Johannesburg Water SOC Ltd', 'Supply Chain Management',
    (v_today + 4 + time '16:00') at time zone tz,
    (v_today + 1 + time '10:00') at time zone tz, false,
    'eTender portal (etenders.gov.za) using CSD login', 'in_progress',
    '80/20 PPPFA 2022 — 80 price, 20 specific goals', 'SMME (EME/QSE) 51%+ black-owned',
    'Not specified — quote standard manufacturer warranty',
    E'• NOVA flagged: MBD 6.1 allocates 80 points to the SMME specific goal, but specific goals are capped at 20 — ask SCM to confirm.\n• Price must include ALL taxes or the bid is disqualified.\n• Each monitor must ship with BOTH the AC power cable and the power adapter.\n• Municipal account must not be older than 3 months and not more than 90 days in arrears.',
    'Confirm the specific-goals points (80 vs 20) with Nompumezo Sobhekwa before submitting.',
    'Re-use the winning July BOQ. Forecast: 82% ready — 3 returnables outstanding, on pace to finish 1 day before closing.',
    v_user)
  returning id into t_jw;

  -- ==================================================== 2. ABAQULUSI TOUCH SCREEN
  insert into public.tenders (company_id, tender_number, title, client, department,
    closing_date, briefing_date, is_briefing_compulsory, submission_method, status,
    evaluation_method, preference_points, warranty_requirements, risks, recommendations, created_by)
  values (v_company, '8/2/1/628', 'Supply, delivery, installation of a 75" interactive touch smart screen display system',
    'Abaqulusi Local Municipality', 'Technical Services',
    (date '2026-08-05' + time '12:00') at time zone tz, null, false,
    'Sealed envelope in tender box — cnr High & Mark St, Vryheid', 'archived',
    'Functionality (min 70/100), then 80/20', 'HDI equity: 100% = 20 pts',
    'Minimum 12 months; >24 months with local support scores 15/15',
    'Not bid: no manufacturer authorisation certificate in time.',
    'Lesson: request manufacturer authorisation on day 1 for any brand-specific tender.', v_user)
  returning id into t_ts_old;

  insert into public.tenders (company_id, tender_number, title, client, department,
    closing_date, briefing_date, is_briefing_compulsory, submission_method, status,
    evaluation_method, preference_points, warranty_requirements, risks, questions, recommendations, created_by)
  values (v_company, '8/2/1/628 (re-issue)', 'Supply, delivery, installation of a 75" interactive touch smart screen display system',
    'Abaqulusi Local Municipality', 'Technical Services',
    (v_today + 10 + time '12:00') at time zone tz,
    (v_today + 2 + time '10:00') at time zone tz, true,
    'Sealed envelope in tender box — cnr High & Mark St, Vryheid', 'in_progress',
    'Functionality (min 70/100), then 80/20', 'HDI equity: 100% = 20 pts, 75–99% = 15, 50–74% = 10',
    'Minimum 12 months; >24 months with local support scores 15/15',
    E'• COMPULSORY site briefing at 112 Mason Street, Vryheid — missing it disqualifies the bid. Vryheid is ~4.5 h from Johannesburg: leave the day before.\n• Functionality threshold 70/100: without 5 reference letters and an ICT-qualified supervisor CV we score about 55 and are eliminated before price.\n• Brand-specific: "V6 Classic Series" — manufacturer authorisation certificate is mandatory.\n• Delivery period printed as 01 Jul – 30 Aug 2026, before the tender was published — ask for a corrected programme.\n• Non-refundable bid fee R1,500 (self-printed) — proof of payment required.',
    E'Can an equivalent 75" 4K display be offered if V6 Classic is unavailable?\nPlease confirm the revised delivery period.',
    'Forecast: functionality score 55–80 depending on reference letters. Get 3 more signed reference letters this week to clear the 70-point threshold.',
    v_user)
  returning id into t_ts;

  -- ========================================================= 3. ABAQULUSI LAPTOPS
  insert into public.tenders (company_id, tender_number, title, client, department,
    closing_date, briefing_date, is_briefing_compulsory, submission_method, status,
    evaluation_method, preference_points, warranty_requirements, risks, recommendations, created_by)
  values (v_company, '8/2/1/627', 'Supply and delivery of 6 x laptop computers',
    'Abaqulusi Local Municipality', 'Technical Services',
    (date '2026-08-05' + time '12:00') at time zone tz, null, false,
    'Sealed envelope in tender box — cnr High & Mark St, Vryheid', 'lost',
    '80/20 PPPFA', 'HDI equity: 100% = 20 pts',
    'Minimum 12 months', 'Lost on price: our i7 quote vs competitors'' i5.',
    'Lesson: when spec and BOQ conflict, ask SCM before pricing.', v_user)
  returning id into t_lp_old;

  insert into public.tenders (company_id, tender_number, title, client, department,
    closing_date, briefing_date, is_briefing_compulsory, submission_method, status,
    evaluation_method, preference_points, warranty_requirements, risks, questions, recommendations, created_by)
  values (v_company, '8/2/1/627 (re-issue)', 'Supply, delivery and configuration of 6 x laptop computers',
    'Abaqulusi Local Municipality', 'Technical Services',
    (v_today + 18 + time '12:00') at time zone tz,
    (v_today + 6 + time '11:00') at time zone tz, false,
    'Sealed envelope in tender box — cnr High & Mark St, Vryheid', 'discovered',
    '80/20 PPPFA', 'HDI equity: 100% = 20 pts',
    'Minimum 12 months',
    E'• NOVA flagged 3 conflicts in this document:\n  1. Quantity — scope says TWO (2) laptops; spec table and BOQ say SIX (6).\n  2. Processor — spec says Core i5 14th gen; BOQ line 1 says Core i7 14th gen.\n  3. Delivery period 01 Jul – 30 Aug 2026 starts before the publish date.\n• Microsoft 365 for business must be installed — licence cost is easy to forget.\n• Audited 3-year AFS only needed above R10m — not applicable here.',
    E'Is the requirement 2 or 6 laptops?\nShould we price Core i5 (spec) or Core i7 (BOQ)?',
    'Send clarification to pnxumalo@abaqulusi.gov.za before pricing. We lost the July round on exactly this i5/i7 conflict.',
    v_user)
  returning id into t_lp;

  -- ============================================================== 4. IDT LAPTOPS
  insert into public.tenders (company_id, tender_number, title, client, department,
    closing_date, briefing_date, is_briefing_compulsory, submission_method, status,
    evaluation_method, preference_points, warranty_requirements, risks, recommendations, created_by)
  values (v_company, 'IDT-LAPTOPS-22JUL2026', 'Procurement and delivery of 19 x HP ProBook 4 G1i 14" laptops — IDT head office',
    'Independent Development Trust', 'Head Office ICT',
    (date '2026-07-31' + time '12:00') at time zone tz, null, false,
    'Email to Quotations1@idt.org.za', 'archived',
    '80/20 — women 6, youth 6, disability 4, black people 4', 'Women 6 · Youth 6 · Disability 4 · Black 4',
    '3 years next-business-day onsite',
    'Missed: SARS tax compliance PIN letter had expired on the closing date.',
    'Lesson: NOVA now warns 14 days before any compliance document expires.', v_user)
  returning id into t_idt_old;

  insert into public.tenders (company_id, tender_number, title, client, department,
    closing_date, briefing_date, is_briefing_compulsory, submission_method, status,
    evaluation_method, preference_points, warranty_requirements, risks, questions, recommendations, created_by)
  values (v_company, 'IDT-LAPTOPS (re-issue)', 'Procurement and delivery of 19 x HP ProBook 4 G1i 14" laptops — IDT head office',
    'Independent Development Trust', 'Head Office ICT',
    (v_today + 1 + time '12:00') at time zone tz,
    (v_today + time '14:00') at time zone tz, false,
    'Email to Quotations1@idt.org.za', 'in_progress',
    '80/20 — women 6, youth 6, disability 4, black people 4', 'Women 6 · Youth 6 · Disability 4 · Black 4',
    '3 years next-business-day onsite (HP Care Pack)',
    E'• CLOSES TOMORROW 12:00 — no queries accepted in the last 12 hours.\n• Two line items (17 + 2) are the same model — quote as 19 units.\n• 3-year NBD onsite warranty must be included in the unit price.\n• Quote must be VAT-inclusive and valid for 30 days.',
    'Exact SKU D3SC8AT — is an equivalent configuration acceptable if stock is short?',
    'Forecast: 90% ready. Only the signed SBD 6.1 is outstanding — sign today and submit by 10:00 tomorrow.',
    v_user)
  returning id into t_idt;

  -- --------------------------------------------------------------- contacts
  insert into public.tender_contacts (company_id, tender_id, name, email, phone, role) values
    (v_company, t_jw,  'Nompumezo Sobhekwa',  'Nompumezo.mramba@jwater.co.za', '011 688 1656', 'Supply Chain Management'),
    (v_company, t_jw,  'Lerato Musimanyana',  'Lerato.musimanyana@jwater.co.za', '011 688 1428', 'End-user department'),
    (v_company, t_ts,  'Mr S Mdlalose',       'ssmdlalose@abaqulusi.gov.za', '034 982 2133 x3306', 'Bidding procedure'),
    (v_company, t_ts,  'Ms PH Nxumalo',       'pnxumalo@abaqulusi.gov.za', '034 982 2133 x2284', 'Technical'),
    (v_company, t_lp,  'Ms PH Nxumalo',       'pnxumalo@abaqulusi.gov.za', '034 982 2133 x2284', 'Technical'),
    (v_company, t_lp,  'SCM Office',          'scm@abaqulusi.gov.za', '034 982 2133 x2277', 'Supply Chain Management'),
    (v_company, t_idt, 'Junior M (SCM)',      'Juniorm@idt.org.za', null, 'SCM queries'),
    (v_company, t_idt, 'Molatelo Makgatho',   'Molatelo.Makgatho@idt.org.za', null, 'Technical queries');

  -- -------------------------------------------------------------- checklists
  -- JW re-issue: 9 of 12 done
  insert into public.tender_checklist_items (company_id, tender_id, label, is_mandatory, is_complete) values
    (v_company, t_jw, 'Quotation on company letterhead (PDF only)', true, true),
    (v_company, t_jw, 'Valid Tax Clearance / SARS PIN', true, true),
    (v_company, t_jw, 'B-BBEE certificate or sworn affidavit (Practice Guide 01 of 2018)', true, true),
    (v_company, t_jw, 'Municipal rates account ≤ 3 months old, ≤ 90 days arrears (or lease)', true, false),
    (v_company, t_jw, 'MBD 4 — Declaration of Interest (signed)', true, true),
    (v_company, t_jw, 'MBD 8 — Past SCM practices (signed)', true, true),
    (v_company, t_jw, 'MBD 9 — Independent Bid Determination (signed)', true, true),
    (v_company, t_jw, 'MBD 6.1 — Preference points claim', true, false),
    (v_company, t_jw, 'MBD 3.1 — Pricing schedule, firm prices, brand & model', true, true),
    (v_company, t_jw, 'Proof of CSD registration (MAAA number)', true, true),
    (v_company, t_jw, 'Company registration docs + ID copies of directors', true, true),
    (v_company, t_jw, 'Monitor datasheet (HDMI 1.4, VGA, USB 3.2, audio in/out, 75 Hz)', true, false);

  -- Touch screen re-issue: 7 of 16 done
  insert into public.tender_checklist_items (company_id, tender_id, label, is_mandatory, is_complete) values
    (v_company, t_ts, 'Attend COMPULSORY briefing — 112 Mason St, Vryheid', true, false),
    (v_company, t_ts, 'Proof of payment — bid fee R1,500', true, true),
    (v_company, t_ts, 'CSD detailed registration report', true, true),
    (v_company, t_ts, 'Company registration documents', true, true),
    (v_company, t_ts, 'SARS PIN / Tax Clearance', true, true),
    (v_company, t_ts, 'Certified B-BBEE certificate or original sworn affidavit', true, true),
    (v_company, t_ts, 'Certified municipal account ≤ 3 months (or lease)', true, false),
    (v_company, t_ts, 'Certified IDs of all directors', true, true),
    (v_company, t_ts, 'Manufacturer authorisation certificate (V6 Classic Series)', true, false),
    (v_company, t_ts, 'Reference letters — 5 similar projects (have 2)', true, false),
    (v_company, t_ts, 'CVs: ICT/engineering-qualified supervisor + assistant', true, false),
    (v_company, t_ts, 'Detailed product specification / datasheet', true, false),
    (v_company, t_ts, 'Signed warranty commitment letter (>24 months)', true, false),
    (v_company, t_ts, 'Methodology & implementation programme', true, false),
    (v_company, t_ts, 'MBD 2, 4, 6.1, 7.1, 8, 9 completed & signed', true, true),
    (v_company, t_ts, 'Public liability insurance', false, false);

  -- Abaqulusi laptops re-issue: just discovered
  insert into public.tender_checklist_items (company_id, tender_id, label, is_mandatory, is_complete) values
    (v_company, t_lp, 'Clarify quantity (2 vs 6) and processor (i5 vs i7) with SCM', true, false),
    (v_company, t_lp, 'CSD detailed registration report', true, true),
    (v_company, t_lp, 'SARS PIN / Tax Clearance', true, true),
    (v_company, t_lp, 'Certified B-BBEE certificate or sworn affidavit', true, true),
    (v_company, t_lp, 'Reference letter — relevant experience', true, false),
    (v_company, t_lp, 'Certified municipal account ≤ 3 months (or lease)', true, false),
    (v_company, t_lp, 'Certified IDs of directors', true, true),
    (v_company, t_lp, 'All MBD forms completed & signed', true, false);

  -- IDT re-issue: 4 of 5 done
  insert into public.tender_checklist_items (company_id, tender_id, label, is_mandatory, is_complete) values
    (v_company, t_idt, 'CSD number (MAAA) on quotation', true, true),
    (v_company, t_idt, 'Valid SARS tax compliance PIN letter', true, true),
    (v_company, t_idt, 'SBD 4 — Bidder''s Disclosure (signed)', true, true),
    (v_company, t_idt, 'SBD 6.1 — Preference points claim (signed)', true, false),
    (v_company, t_idt, 'VAT-inclusive quote, valid 30 days, incl. 3-yr NBD onsite warranty', true, true);

  -- Closed tenders: all complete
  insert into public.tender_checklist_items (company_id, tender_id, label, is_mandatory, is_complete) values
    (v_company, t_jw_old, 'All 9 compulsory returnables', true, true),
    (v_company, t_lp_old, 'All MBD forms and returnables', true, true),
    (v_company, t_idt_old, 'Valid SARS tax compliance PIN letter', true, false),
    (v_company, t_ts_old, 'Manufacturer authorisation certificate', true, false);

  -- ------------------------------------------------------------------ tasks
  insert into public.tender_tasks (company_id, tender_id, title, description, assignee_id, due_date, status) values
    (v_company, t_idt, 'Sign SBD 6.1 and email quote', 'Send to Quotations1@idt.org.za before 12:00', v_user, v_today, 'pending'),
    (v_company, t_jw,  'Get latest municipal rates statement', 'Must be ≤ 3 months old', v_user, v_today + 1, 'pending'),
    (v_company, t_jw,  'Upload monitor datasheet', null, v_user, v_today + 2, 'pending'),
    (v_company, t_ts,  'Drive to Vryheid for compulsory briefing', 'Leave the afternoon before; briefing at 10:00', v_user, v_today + 1, 'pending'),
    (v_company, t_ts,  'Request manufacturer authorisation (V6 Classic)', null, v_user, v_today + 3, 'pending'),
    (v_company, t_ts,  'Collect 3 more signed reference letters', 'Needed to clear the 70-point functionality threshold', v_user, v_today + 5, 'pending'),
    (v_company, t_lp,  'Email clarification: 2 vs 6 laptops, i5 vs i7', 'To pnxumalo@abaqulusi.gov.za', v_user, v_today + 2, 'pending'),
    (v_company, t_jw_old, 'Deliver 30 monitors to Johannesburg Water', null, v_user, date '2026-08-20', 'done');

  -- ------------------------------------------------------------------ notes
  insert into public.tender_notes (company_id, tender_id, author_id, body) values
    (v_company, t_jw,  v_user, 'Demo data: re-issue dates are set relative to today so countdowns stay live during judging.'),
    (v_company, t_ts,  v_user, 'Demo data: briefing session added for the demonstration; the original advert had none.'),
    (v_company, t_lp,  v_user, 'NOVA read the 72-page document and found the quantity and processor conflicts in under a minute.'),
    (v_company, t_idt, v_user, 'Supplier quotes: Ubuntu ICT R23,700/unit incl. Care Pack; Gauteng Notebook R24,450/unit.');

  -- --------------------------------------------------------------- timeline
  insert into public.tender_timeline_events (company_id, tender_id, event_type, description, occurred_at, created_by) values
    (v_company, t_jw_old, 'created',   'Imported from eTender portal', (date '2026-07-22' + time '09:00') at time zone tz, v_user),
    (v_company, t_jw_old, 'submitted', 'Submitted on eTender portal', (date '2026-07-28' + time '15:10') at time zone tz, v_user),
    (v_company, t_jw_old, 'won',       'Award letter received',        (date '2026-08-12' + time '11:00') at time zone tz, v_user),
    (v_company, t_lp_old, 'submitted', 'Hand-delivered to tender box', (date '2026-08-05' + time '10:30') at time zone tz, v_user),
    (v_company, t_lp_old, 'lost',      'Awarded to another bidder (price)', (date '2026-09-02' + time '09:00') at time zone tz, v_user),
    (v_company, t_jw,  'created', 'Re-issue detected — cloned July BOQ and checklist', now() - interval '3 days', v_user),
    (v_company, t_ts,  'created', 'Imported from eTender portal', now() - interval '2 days', v_user),
    (v_company, t_lp,  'created', 'Scanned with NOVA mobile', now() - interval '6 hours', v_user),
    (v_company, t_idt, 'created', 'Imported from email', now() - interval '4 days', v_user);

  insert into public.tender_submissions (company_id, tender_id, submitted_at, method, reference_number, notes) values
    (v_company, t_jw_old, (date '2026-07-28' + time '15:10') at time zone tz, 'eTender portal', 'ETP-2026-0728-4471', 'Awarded 12 Aug 2026'),
    (v_company, t_lp_old, (date '2026-08-05' + time '10:30') at time zone tz, 'Tender box', null, 'Unsuccessful');

  -- ------------------------------------------------------------ tender suppliers
  insert into public.tender_suppliers (company_id, tender_id, supplier_id, status, notes) values
    (v_company, t_jw,  s_ict, 'quoted', 'R2,150 per monitor, 5-day lead time'),
    (v_company, t_ts,  s_av,  'requested', 'Awaiting V6 Classic authorisation letter'),
    (v_company, t_idt, s_ict, 'quoted', 'R23,700 incl. 3-yr Care Pack'),
    (v_company, t_idt, s_hp,  'quoted', 'R24,450 incl. 3-yr Care Pack');

  -- --------------------------------------------------------------------- BOQ
  -- selling_price etc. use the app's formula (boq-calculations.ts):
  -- cost/unit = sum of rates; profit = cost × qty × markup; selling = (cost + profit) × (1 + VAT).
  insert into public.boq_items (company_id, tender_id, description, quantity, unit, sort_order,
    supplier_cost, freight, insurance, labour, travel, accommodation, support, warranty, overheads, risk, contingency,
    markup_percent, vat_percent, gross_profit, net_profit, selling_price)
  select v_company, tender_id, description, qty, unit, sort_order,
         sc, fr, ins, lab, trv, acc, sup, war, ovh, rsk, con,
         mk, 15,
         round(qty * (sc+fr+ins+lab+trv+acc+sup+war+ovh+rsk+con) * mk / 100, 2),
         round(qty * (sc+fr+ins+lab+trv+acc+sup+war+ovh+rsk+con) * mk / 100, 2),
         round(qty * (sc+fr+ins+lab+trv+acc+sup+war+ovh+rsk+con) * (1 + mk/100) * 1.15, 2)
  from (values
    -- tender, description, qty, unit, order, supplier, freight, insurance, labour, travel, accom, support, warranty, overheads, risk, contingency, markup%
    (t_jw_old, '23.8" FHD 75 Hz LED monitor incl. AC cable & power adapter', 30::numeric, 'Each', 1, 2150::numeric, 60::numeric, 15::numeric, 0::numeric, 0::numeric, 0::numeric, 0::numeric, 40::numeric, 80::numeric, 0::numeric, 0::numeric, 15::numeric),
    (t_jw,     '23.8" FHD 75 Hz LED monitor incl. AC cable & power adapter', 30, 'Each', 1, 2150, 60, 15, 0, 0, 0, 0, 40, 80, 0, 25, 15),
    (t_ts,     '75" 4K interactive display, 20-point touch, camera, mic array', 1, 'No', 1, 48000, 650, 400, 0, 0, 0, 0, 0, 1500, 1200, 0, 18),
    (t_ts,     'Wall-mount bracket & cabling (HDMI, power, data)', 1, 'Sum', 2, 2600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18),
    (t_ts,     'Installation, notice-board removal & making good', 1, 'Sum', 3, 0, 0, 0, 6500, 2400, 1600, 0, 0, 0, 0, 800, 18),
    (t_ts,     'Configuration, testing, commissioning & user training', 1, 'Sum', 4, 0, 0, 0, 0, 0, 0, 3000, 0, 0, 0, 0, 18),
    (t_ts,     'Extended 36-month warranty with local support', 1, 'Sum', 5, 0, 0, 0, 0, 0, 0, 0, 4500, 0, 0, 0, 18),
    (t_idt,    'HP ProBook 4 G1i 14" (D3SC8AT) Core 7 150U, 24 GB, 512 GB SSD', 19, 'Each', 1, 21500, 80, 60, 0, 0, 0, 0, 2200, 150, 0, 0, 12),
    (t_lp,     'Laptop, Core i5 14th gen, 32 GB, 1 TB SSD, 15", Win 11 Pro, M365 (pending clarification)', 6, 'No', 1, 19800, 120, 60, 350, 0, 0, 0, 0, 200, 0, 300, 15)
  ) as v(tender_id, description, qty, unit, sort_order, sc, fr, ins, lab, trv, acc, sup, war, ovh, rsk, con, mk);

  raise notice 'Demo Company seeded for % (company %)', v_email, v_company;
end $$;
