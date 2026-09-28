/* ============================================================
   SỔ CHỦ NHIỆM ĐIỆN TỬ — CORE LOGIC
   Tác giả: Cô Trịnh Ngọc Ánh — THPT Tân Yên số 2
   ============================================================ */
'use strict';

/* ============ HẰNG SỐ ============ */
const DEFAULT_STUDENTS = [
    "Nguyễn Huyền Anh", "Hoàng Trung Hiếu", "Dương Ngọc Nhi", "Dương Ngọc Sơn", "Lê Minh Công",
    "Nguyễn Thị Huyền Trang", "Dương Nguyễn Phương Anh", "Triệu Gia Bảo", "Nguyễn Duy Biên",
    "Nguyễn Văn Dũng", "Nguyễn Văn Duy", "Tạ Văn Duy", "Nguyễn Văn Đồng", "Tạ Trung Đức",
    "Hoàng Thị Thu Hằng", "Nguyễn Thị Thu Hiền", "Giáp Thị Ngọc Huệ", "Lê Ngọc Huy",
    "Nguyễn Thị Khánh Huyền", "Lê Ngọc Khánh", "Dương Anh Linh", "Phạm Khánh Linh",
    "Lê Thị Quỳnh Mai", "Thân Đức Mạnh", "Lê Thị Phương Minh", "Giáp Thị Trà My",
    "Nguyễn Hoàng My", "Nguyễn Hoàng Vân Ngọc", "Thân Thị Tuyết Nhung", "Nguyễn Thị Hồng Nhung",
    "Ninh Nguyễn Diệu Oanh", "Dương Thanh Phong", "Đàm Tuấn Phong", "Nguyễn Hồng Phong",
    "Nguyễn Đăng Thiên Phú", "Nguyễn Đức Quảng", "Nguyễn Danh Sinh", "Nguyễn Đình Thanh",
    "Chu Hoài Thương", "Nguyễn Việt Tiến", "Lâm Thị Trang", "Đoàn Thị Quỳnh Trang",
    "Thân Thị Ánh Tuyết", "Giáp Lâm Vũ", "Chúc Thị Phương Anh"
];

/* ============ DANH SÁCH MÔN HỌC ============ */
const SUBJECTS = [
    { code: 'TO',      name: 'Toán' },
    { code: 'VA',      name: 'Ngữ văn' },
    { code: 'TA',      name: 'Tiếng Anh' },
    { code: 'LY',      name: 'Vật lý' },
    { code: 'HO',      name: 'Hóa học' },
    { code: 'SI',      name: 'Sinh học' },
    { code: 'SU',      name: 'Lịch sử' },
    { code: 'DI',      name: 'Địa lý' },
    { code: 'GDKTPL',  name: 'GDKT&PL' },
    { code: 'TI',      name: 'Tin học' },
    { code: 'CN',      name: 'Công nghệ' },
    { code: 'GDTC',    name: 'Thể dục' },
    { code: 'GDQP',    name: 'GDQP-AN' },
    { code: 'HĐTN',    name: 'HĐTN-HN' },
    { code: 'GDDP',    name: 'GD địa phương' },
    { code: 'AN',      name: 'Âm nhạc' },
    { code: 'MT',      name: 'Mỹ thuật' }
];
window.SUBJECTS = SUBJECTS;

/* ============ Helper tạo datalist HTML ============ */
window.getSubjectsDatalistHTML = function() {
    let html = '<datalist id="subjects-list">';
    SUBJECTS.forEach(function(s) {
        html += '<option value="' + s.code + ' - ' + s.name + '">';
    });
    html += '</datalist>';
    return html;
};

const MONTH_WEEKS = {
    "Tháng 9": [1,2,3,4], "Tháng 10": [5,6,7,8], "Tháng 11": [9,10,11,12],
    "Tháng 12": [13,14,15,16], "Tháng 1": [17,18,19,20], "Tháng 2": [21,22,23,24],
    "Tháng 3": [25,26,27,28], "Tháng 4": [29,30,31,32], "Tháng 5": [33,34,35],
    "Học Kỳ 1": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
    "Học Kỳ 2": [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35],
    "Cả Năm": Array.from({length: 35}, (_, i) => i + 1)
};

/* Nội quy theo PDF chính thức */
const DEFAULT_ERROR_TYPES = [
    // ĐỘT XUẤT
    { key:'htnv',   label:'CBL không hoàn thành NV',  pen:30, group:0 },
    { key:'tdx',    label:'Trừ đột xuất (GVCN)',      pen:'custom_sub', group:0 },
    { key:'cdx',    label:'Cộng đột xuất (GVCN)',     pen:'custom_add', group:0, isBonus:true },

    // NGHỈ HỌC
    { key:'cp',     label:'Nghỉ có phép (CP)',        pen:20, group:1 },
    { key:'kp',     label:'Nghỉ không phép (KP)',     pen:50, group:1 },

    // ĐI MUỘN
    { key:'dhm1',   label:'Đi muộn < 3 phút',         pen:10, group:2 },
    { key:'dhm2',   label:'Đi muộn 3–5 phút',         pen:20, group:2 },
    { key:'dhm3',   label:'Đi muộn > 5 phút',         pen:30, group:2 },

    // TÁC PHONG
    { key:'dp',     label:'Không đồng phục, thẻ HS',  pen:20, group:3 },
    { key:'mbh',    label:'Không đội MBH',            pen:30, group:3 },
    { key:'dixe',   label:'Đi xe trong sân trường',   pen:30, group:3 },
    { key:'dthoai', label:'Sử dụng điện thoại',       pen:100, group:3 },

    // Ý THỨC
    { key:'nc',     label:'Nói chuyện, làm việc riêng', pen:20, group:4 },
    { key:'svt',    label:'Ngồi sai vị trí',          pen:10, group:4 },
    { key:'truc',   label:'Trực nhật bẩn',            pen:5,  group:4 },

    // HỌC TẬP
    { key:'bc',     label:'Báo cáo chậm',             pen:5,  group:5 },
    { key:'codo',   label:'Lỗi cờ đỏ, xung kích',     pen:10, group:5 },
    { key:'sdb',    label:'Lỗi SĐB',                  pen:30, group:5 },
    { key:'dodung', label:'Thiếu ĐD, DC học tập',     pen:20, group:5 },
    { key:'baicu',  label:'Không học/làm bài cũ',     pen:30, group:5 },

    // ĐIỂM CỘNG
    { key:'dx9_tx',     label:'Điểm ≥9 (thường xuyên)', pen:-5,  group:11, isBonus:true },
    { key:'dx9_dk',     label:'Điểm ≥9 (định kỳ)',      pen:-10, group:11, isBonus:true },
    { key:'dx8_tx',     label:'Điểm ≥8 (thường xuyên)', pen:-2,  group:11, isBonus:true },
    { key:'hdlop',      label:'Tham gia HĐ lớp',        pen:-20, group:11, isBonus:true },
    { key:'hdtruong',   label:'Tham gia HĐ trường',     pen:-20, group:11, isBonus:true },
    { key:'phatbieu',   label:'Phát biểu',              pen:-2,  group:11, isBonus:true },
    { key:'thuyettrinh',label:'Thuyết trình',           pen:-10, group:11, isBonus:true }
];

const DEFAULT_RULE_GROUPS = {
    0:  { name:'ĐỘT XUẤT (GVCN)',   color:'#64748b' },
    1:  { name:'NGHỈ HỌC',          color:'#dc2626' },
    2:  { name:'ĐI MUỘN',           color:'#d97706' },
    3:  { name:'TÁC PHONG',         color:'#7c3aed' },
    4:  { name:'Ý THỨC',            color:'#0d9488' },
    5:  { name:'HỌC TẬP',           color:'#1e40af' },
    11: { name:'ĐIỂM CỘNG',         color:'#65a30d' }
};

const DEFAULT_RESP_ROLES = [
    { name: 'Lớp trưởng', points: 30 },
    { name: 'Bí thư',     points: 30 },
    { name: 'Lớp phó',    points: 20 },
    { name: 'Tổ trưởng',  points: 20 },
    { name: 'Sao đỏ',     points: 10 },
    { name: 'Giữ SĐB',    points: 10 }
];

const firebaseConfig = {
    apiKey: "AIzaSyDv39_t5V_B4NJjC_n5Y1zgi5aBlOuF4lE",
    authDomain: "quanlyhoctap-coanh.firebaseapp.com",
    databaseURL: "https://quanlyhoctap-coanh-default-rtdb.firebaseio.com",
    projectId: "quanlyhoctap-coanh",
    storageBucket: "quanlyhoctap-coanh.firebasestorage.app"
};

const SUPER_ADMIN_PASS = "master2026@admin";
const PW_SALT = 'CHUNHIEMSO_2026_SALT_V2';
const PW_ROLES = [
    { key:'to1', label:'Tổ 1', icon:'1', default:'1111' },
    { key:'to2', label:'Tổ 2', icon:'2', default:'2222' },
    { key:'to3', label:'Tổ 3', icon:'3', default:'3333' },
    { key:'to4', label:'Tổ 4', icon:'4', default:'4444' },
    { key:'loptruong', label:'Lớp trưởng', icon:'*', default:'1234' },
    { key:'lophoLĐ', label:'Lớp phó LĐ', icon:'@', default:'5555' }
];

const MSG_TEMPLATE_DEFAULT =
    'GVCN lớp {ten_lop} thông báo:\n\n' +
    'Cuộc thi "{ten_cuoc_thi}" sắp hết hạn vào {han_nop}.\n\n' +
    'Danh sách {so_luong} bạn CHƯA nộp ảnh minh chứng:\n' +
    '{danh_sach_chua_nop}\n\n' +
    'Vui lòng vào web của lớp nộp bài trước hạn. Trân trọng!\n\n' +
    '{ten_gv}';

/* ============ STATE ============ */
window.STATE = {
    students: [], phones: {}, positions: {}, studentGroups: {},
    groupLabelSwap: { 1:1, 2:2, 3:3, 4:4 },
    emulation: {}, map: {}, notices: [], duty: {},
    officialGrades: {}, config: {},
    photoContests: {}, photoSubmissions: {}, driveConfig: {},
    passwords: {}, editLocks: {}, weekDeadlines: {},
    customRules: [], deletedRules: [],
    respRoles: null,
    tkb: null,
    tkbByWeek: {}, 
    systemConfig: { deepseekKey: '' },
    seatingLayout: '4x12',
    dbRef: null
};
window.isTeacherLoggedIn = false;
window.selectedPosForSwap = null;
window.currentInputRole = 'totruong';

/* ============ SANITIZE ============ */
function sanitizeState() {
    if (!STATE.students?.length) STATE.students = [...DEFAULT_STUDENTS];
    if (!STATE.phones) STATE.phones = {};
    if (!STATE.positions) STATE.positions = {};
    if (!STATE.studentGroups) STATE.studentGroups = {};
    if (!STATE.groupLabelSwap) STATE.groupLabelSwap = { 1:1, 2:2, 3:3, 4:4 };
    if (!STATE.emulation) STATE.emulation = {};
    if (!STATE.map || !Object.keys(STATE.map).length) {
        STATE.map = {};
        for (let i = 1; i <= 48; i++) STATE.map['pos_' + i] = i <= STATE.students.length ? i : null;
    }
    if (!STATE.passwords || !Object.keys(STATE.passwords).length) {
        STATE.passwords = { to1:{}, to2:{}, to3:{}, to4:{}, loptruong:{}, lophoLĐ:{} };
    }
    if (!STATE.editLocks) STATE.editLocks = {};
    if (!STATE.notices) STATE.notices = [];
    if (!STATE.photoContests) STATE.photoContests = {};
    if (!STATE.photoSubmissions) STATE.photoSubmissions = {};
    if (!STATE.driveConfig) STATE.driveConfig = { folderId:'', secretKey:'', appsScriptUrl:'' };
    if (!STATE.duty) STATE.duty = {};
    if (!STATE.officialGrades) STATE.officialGrades = {};
    if (!STATE.weekDeadlines) STATE.weekDeadlines = {};
    if (!Array.isArray(STATE.customRules)) STATE.customRules = [];
    if (!Array.isArray(STATE.deletedRules)) STATE.deletedRules = [];
    if (!Array.isArray(STATE.respRoles) || !STATE.respRoles.length) STATE.respRoles = [...DEFAULT_RESP_ROLES];
    if (!STATE.tkb || !STATE.tkb.data || !STATE.tkb.data.length) {
        STATE.tkb = { numTiet: 5, data: Array.from({length:5}, () => ['Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'].map(() => ({ mon:'', gv:'' }))) };
    }
    if (!STATE.tkbByWeek || typeof STATE.tkbByWeek !== 'object') STATE.tkbByWeek = {};
    if (!STATE.systemConfig) STATE.systemConfig = { deepseekKey: '' };
    if (!STATE.seatingLayout) STATE.seatingLayout = '4x12';
    if (!STATE.config || !STATE.config.schoolName) {
        STATE.config = {
            schoolName: "Trường THPT Tân Yên số 2",
            className: "Lớp 11A5",
            schoolYear: "2026 - 2027",
            teacherName: "Trịnh Ngọc Ánh",
            startDate: "2026-09-07",
            deadlineDay: 1,
            deadlineHour: 23
        };
    }
}

/* ============ LOAD / SAVE LOCAL ============ */
function loadLocalData() {
    const keys = ['students','phones','positions','studentGroups','groupLabelSwap','emulation','map',
                  'notices','duty','photoContests','photoSubmissions','driveConfig','officialGrades',
                  'config','passwords','editLocks','weekDeadlines','customRules','deletedRules',
                  'respRoles','tkb','systemConfig','seatingLayout'];
    keys.forEach(k => {
        try {
            const v = localStorage.getItem(k);
            if (v && v !== "null") STATE[k] = JSON.parse(v);
        } catch(e) { console.warn('Lỗi nạp local:', k, e); }
    });
}

window.saveData = function(key, valueObj) {
    if (STATE[key] !== undefined) STATE[key] = valueObj;
    if (STATE.dbRef) {
        try {
            const dbKey = key === 'systemConfig' ? '_systemConfig' : key;
            STATE.dbRef.child(dbKey).set(JSON.stringify(valueObj));
        } catch(e) {}
    }
    try { localStorage.setItem(key, JSON.stringify(valueObj)); } catch(e) {}
};

/* ============ ERROR_TYPES (động) ============ */
window.ERROR_TYPES = [];
function rebuildErrorTypes() {
    ERROR_TYPES.length = 0;
    DEFAULT_ERROR_TYPES.forEach(r => {
        if (!STATE.deletedRules.includes(r.key)) ERROR_TYPES.push({ ...r });
    });
    STATE.customRules.forEach(cr => {
        if (STATE.deletedRules.includes(cr.key)) return;
        const idx = ERROR_TYPES.findIndex(r => r.key === cr.key);
        if (idx > -1) {
            ERROR_TYPES[idx].label = cr.label;
            ERROR_TYPES[idx].pen = cr.pen;
            ERROR_TYPES[idx].group = cr.group;
        } else {
            ERROR_TYPES.push({
                key: cr.key,
                label: cr.label,
                pen: cr.pen,
                group: cr.group,
                isBonus: cr.isBonus || (typeof cr.pen === 'number' && cr.pen < 0) || cr.pen === 'custom_add'
            });
        }
    });
}
window.rebuildErrorTypes = rebuildErrorTypes;

window.RULE_GROUPS = { ...DEFAULT_RULE_GROUPS };

/* ============ INIT ============ */
window.onload = function() {
    loadLocalData();
    sanitizeState();
    rebuildErrorTypes();
    window.buildUI();

    if (typeof firebase !== 'undefined') {
        try {
            if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
            STATE.dbRef = firebase.database().ref('THPT_Tan_Yen_2_' + MA_DU_LIEU);
            STATE.dbRef.once('value').then(snapshot => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    Object.keys(data).forEach(k => {
                        if (data[k] && data[k] !== "null") {
                            const realKey = k === '_systemConfig' ? 'systemConfig' : k;
                            try {
                                STATE[realKey] = (realKey === 'config' || realKey === 'driveConfig' || realKey === 'groupLabelSwap' || realKey === 'systemConfig')
                                    ? { ...STATE[realKey], ...JSON.parse(data[k]) }
                                    : JSON.parse(data[k]);
                            } catch(e) {}
                        }
                    });
                    sanitizeState();
                    rebuildErrorTypes();
                    window.buildUI();
                }
            }).catch(err => console.warn("Firebase fetch:", err));

            firebase.auth().onAuthStateChanged(user => {
                if (user && user.email === 'gvcn@chunhiemso.com') {
                    window.isTeacherLoggedIn = true;
                    updateAdminTabUI(true);
                } else {
                    window.isTeacherLoggedIn = false;
                    updateAdminTabUI(false);
                }
            });
        } catch(e) { console.warn("Firebase init:", e); }
    }
};

/* ============ BUILD UI ============ */
window.buildUI = function() {
    const safe = fn => { try { fn(); } catch(e) { console.warn(e); } };
    safe(updateConfigUI);
    safe(populateSelects);
    safe(updateRealtimeWeekDisplay);
    safe(autoSelectCurrentWeek);
    safe(renderSeatingMap);
    safe(renderAdminSeatingMap);
    safe(renderAdminStudentManager);
    safe(renderPublicDuty);
    safe(renderPublicDutyMobile);
    safe(renderAdminZaloSummary);
    safe(renderPublicPhotoSection);
    safe(renderAdminContestManager);
    safe(renderPasswordManager);
    safe(renderWeekDeadlinesManager);
    safe(renderRespRoles);
    safe(renderRuleManager);
    safe(renderTkbEditable);
    safe(renderTkbPublic);
    safe(renderTkbManagerUI);
    safe(renderContestManagerUI);
    safe(toggleAdminPrintType);
    safe(updateDeadlineUI);
    safe(renderRulesModal);
};

/* ============ CONFIG ============ */
window.updateConfigUI = function() {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || ''; };
    const val = (id, v) => { const el = document.getElementById(id); if (el) el.value = v ?? ''; };
    set('banner-school', STATE.config.schoolName);
    set('banner-class', STATE.config.className);
    set('banner-year', STATE.config.schoolYear);
    set('banner-teacher', STATE.config.teacherName);
    val('config-school', STATE.config.schoolName);
    val('config-class', STATE.config.className);
    val('config-year', STATE.config.schoolYear);
    val('config-teacher', STATE.config.teacherName);
    val('config-start-date', STATE.config.startDate);
    val('config-deadline-day', STATE.config.deadlineDay ?? 1);
    val('config-deadline-hour', STATE.config.deadlineHour ?? 23);
};

window.saveConfigData = function() {
    STATE.config.schoolName = document.getElementById('config-school').value;
    STATE.config.className = document.getElementById('config-class').value;
    STATE.config.schoolYear = document.getElementById('config-year').value;
    STATE.config.teacherName = document.getElementById('config-teacher').value;
    STATE.config.startDate = document.getElementById('config-start-date').value;
    STATE.config.deadlineDay = parseInt(document.getElementById('config-deadline-day').value);
    STATE.config.deadlineHour = parseInt(document.getElementById('config-deadline-hour').value);
    saveData('config', STATE.config);
    updateConfigUI();
    updateRealtimeWeekDisplay();
    alert("Đã lưu cấu hình!");
};

/* ============ TUẦN THỰC ============ */
function getCurrentRealWeek() {
    if (!STATE.config.startDate) return 0;
    const start = new Date(STATE.config.startDate);
    if (isNaN(start.getTime())) return 0;
    const diff = Date.now() - start.getTime();
    if (diff < 0) return 0;
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
}

window.updateRealtimeWeekDisplay = function() {
    const realWeek = getCurrentRealWeek();
    const badge = document.getElementById("live-realtime-week-badge");
    if (!badge) return;
    if (realWeek <= 0) {
        badge.innerHTML = `<i class="fa-solid fa-hourglass-start"></i> Chưa đến năm học mới`;
        return;
    }
    const start = new Date(STATE.config.startDate);
    const ws = new Date(start.getTime() + (realWeek - 1) * 7 * 86400000);
    const we = new Date(ws.getTime() + 6 * 86400000);
    const fmt = d => `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
    badge.innerHTML = `<i class="fa-regular fa-calendar-check"></i> Tuần ${realWeek} (${fmt(ws)} - ${fmt(we)})`;
};

window.autoSelectCurrentWeek = function() {
    const cw = getCurrentRealWeek();
    if (cw <= 0) return;
    const target = "Tuần " + cw;
    for (const m in MONTH_WEEKS) {
        if (m.startsWith("Tháng") && MONTH_WEEKS[m].includes(cw)) {
            const ms = document.getElementById('input-month-select');
            if (ms) {
                ms.value = m;
                updateInputWeekOptions();
                const ws = document.getElementById('input-week-select');
                if (ws) ws.value = target;
                resetInputAuth();
            }
            break;
        }
    }
    ['public-duty-week-select','mobile-duty-week-select','seating-week-select'].forEach(id => {
        const el = document.getElementById(id);
        if (el && el.querySelector(`option[value="${target}"]`)) el.value = target;
    });
};

/* ============ POPULATE SELECTS ============ */
window.populateSelects = function() {
    let monthHTML = "";
    for (const m in MONTH_WEEKS) if (m.startsWith("Tháng")) monthHTML += `<option value="${m}">${m}</option>`;

    ['public-month-select','input-month-select','seating-month-select'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = monthHTML;
    });

    const dm = document.getElementById('public-detail-month-select');
    const dmm = document.getElementById('mobile-detail-month-select');
    const fullMonthHTML = monthHTML + `<optgroup label="Học Kỳ & Cả Năm">
        <option value="Học Kỳ 1">Học Kỳ 1</option>
        <option value="Học Kỳ 2">Học Kỳ 2</option>
        <option value="Cả Năm">Cả Năm</option></optgroup>`;
    if (dm) dm.innerHTML = fullMonthHTML;
    if (dmm) dmm.innerHTML = fullMonthHTML;

    const gp = document.getElementById('admin-grading-period');
    if (gp) gp.innerHTML = `<optgroup label="Xếp Loại Tháng">
        <option value="Tháng 9">Tháng 9</option><option value="Tháng 10">Tháng 10</option><option value="Tháng 11">Tháng 11</option>
        <option value="Tháng 12">Tháng 12</option><option value="Tháng 1">Tháng 1</option><option value="Tháng 2">Tháng 2</option>
        <option value="Tháng 3">Tháng 3</option><option value="Tháng 4">Tháng 4</option><option value="Tháng 5">Tháng 5</option>
        </optgroup>
        <optgroup label="Học Kỳ & Năm">
        <option value="Học Kỳ 1">Học Kỳ 1</option><option value="Học Kỳ 2">Học Kỳ 2</option><option value="Cả Năm">Cả Năm</option>
        </optgroup>`;

    let stdHTML = '<option value="">-- Chọn học sinh --</option>';
    STATE.students.forEach((n, i) => { stdHTML += `<option value="${i+1}">STT ${i+1} - ${n}</option>`; });
    ['public-student-select','mobile-student-select','admin-print-student'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = stdHTML;
    });

    let wHTML = "";
    for (let i = 1; i <= 35; i++) wHTML += `<option value="Tuần ${i}">Tuần ${i}</option>`;
    ['public-detail-week-select','mobile-detail-week-select','public-duty-week-select','mobile-duty-week-select','admin-zalo-week-select'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = wHTML;
    });

    updateSummaryWeekOptions();
    updateInputWeekOptions();
    updateSeatingWeekOptions();
};

window.updateSummaryWeekOptions = function() {
    const m = document.getElementById('public-month-select')?.value;
    let html = "";
    (MONTH_WEEKS[m] || []).forEach(w => html += `<option value="Tuần ${w}">Tuần ${w}</option>`);
    const el = document.getElementById('public-week-select');
    if (el) el.innerHTML = html;
    renderPublicSummaryTable();
};

window.updateInputWeekOptions = function() {
    const m = document.getElementById('input-month-select')?.value;
    let html = "";
    (MONTH_WEEKS[m] || []).forEach(w => html += `<option value="Tuần ${w}">Tuần ${w}</option>`);
    const el = document.getElementById('input-week-select');
    if (el) el.innerHTML = html;
    resetInputAuth();
};

window.updateSeatingWeekOptions = function() {
    const m = document.getElementById('seating-month-select')?.value;
    let html = "";
    (MONTH_WEEKS[m] || []).forEach(w => html += `<option value="Tuần ${w}">Tuần ${w}</option>`);
    const el = document.getElementById('seating-week-select');
    if (el) el.innerHTML = html;
    renderSeatingMap();
};

window.toggleSearchType = function() {
    const type = document.getElementById('search-type-select').value;
    document.getElementById('fg-detail-week').style.display = type === 'week' ? "block" : "none";
    document.getElementById('fg-detail-month').style.display = type === 'week' ? "none" : "block";
};

window.toggleMobileSearchType = function() {
    const type = document.getElementById('mobile-search-type').value;
    document.getElementById('mobile-fg-week').style.display = type === 'week' ? "block" : "none";
    document.getElementById('mobile-fg-month').style.display = type === 'week' ? "none" : "block";
};

window.toggleSummaryMode = function() {
    const mode = document.getElementById('emulation-view-mode').value;
    document.getElementById('public-week-select').style.display = (mode === 'week') ? 'inline-block' : 'none';
    document.getElementById('public-month-select').style.display = (mode === 'month') ? 'inline-block' : 'none';
    renderPublicSummaryTable();
};

window.toggleAdminPrintType = function() {
    const type = document.getElementById('admin-print-type').value;
    const sel = document.getElementById('admin-print-period');
    let html = "";
    if (type === 'week') { for (let i = 1; i <= 35; i++) html += `<option value="Tuần ${i}">Tuần ${i}</option>`; }
    else if (type === 'month') { for (const m in MONTH_WEEKS) if (m.startsWith("Tháng")) html += `<option value="${m}">${m}</option>`; }
    else if (type === 'semester') { html += `<option value="Học Kỳ 1">Học Kỳ 1</option><option value="Học Kỳ 2">Học Kỳ 2</option>`; }
    else if (type === 'year') { html += `<option value="Cả Năm">Cả Năm</option>`; }
    if (sel) sel.innerHTML = html;
};

/* ============ TAB SWITCHING ============ */
window.switchMainTab = function(tabId) {
    if (tabId === 'tab3' && !window.isTeacherLoggedIn) {
        openLoginModal();
        return;
    }
    document.querySelectorAll(".tab-content").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".main-tab").forEach(b => b.classList.remove("active"));
    document.getElementById("panel-" + tabId)?.classList.add("active");
    document.getElementById("nav-btn-" + tabId)?.classList.add("active");

    resetInputAuth();

    if (tabId === 'tab1') { renderSeatingMap(); renderPublicDuty(); renderTkbPublic(); }
    if (tabId === 'tab2') { autoSelectCurrentWeek(); }
    if (tabId === 'tab3') {
        renderAdminStudentManager();
        renderAdminSeatingMap();
        renderPasswordManager();
        renderWeekDeadlinesManager();
        renderRespRoles();
        renderRuleManager();
        renderTkbManagerUI();
        renderTkbByWeekUI();
        renderContestManagerUI();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.requireTeacherAuth = function() {
    if (window.isTeacherLoggedIn) switchMainTab('tab3');
    else openLoginModal();
};

/* ============ LOGIN MODAL ============ */
window.openLoginModal = function() {
    document.getElementById('loginModal').classList.add('open');
    setTimeout(() => document.getElementById('admin-pass-input')?.focus(), 100);
};

window.closeLoginModal = function() {
    document.getElementById('loginModal').classList.remove('open');
    const inp = document.getElementById('admin-pass-input');
    if (inp) inp.value = '';
    document.getElementById('loginError')?.classList.remove('show');
};

window.verifyTeacherPassword = function() {
    const password = document.getElementById('admin-pass-input').value;
    const TEACHER_EMAIL = 'gvcn@chunhiemso.com';
    if (!password) return alert('Nhập mật khẩu!');

    firebase.auth().signInWithEmailAndPassword(TEACHER_EMAIL, password)
        .then(() => {
            window.isTeacherLoggedIn = true;
            closeLoginModal();
            updateAdminTabUI(true);
            switchMainTab('tab3');
        })
        .catch(error => {
            document.getElementById('loginError').classList.add('show');
            document.getElementById('admin-pass-input').value = '';
            document.getElementById('admin-pass-input').focus();
            console.error('Login error:', error);
        });
};

window.teacherLogout = function() {
    if (!confirm('Đăng xuất?')) return;
    firebase.auth().signOut().then(() => {
        window.isTeacherLoggedIn = false;
        updateAdminTabUI(false);
        document.getElementById('superAdminBlock')?.classList.remove('show');
        switchMainTab('tab1');
    }).catch(err => alert('Lỗi: ' + err.message));
};

function updateAdminTabUI(loggedIn) {
    const badge = document.getElementById('lockBadge');
    const tabBtn = document.getElementById('nav-btn-tab3');
    if (!badge || !tabBtn) return;
    if (loggedIn) {
        badge.textContent = 'Mở';
        tabBtn.classList.add('unlocked');
    } else {
        badge.textContent = 'Khóa';
        tabBtn.classList.remove('unlocked');
    }
}
window.updateAdminTabUI = updateAdminTabUI;

/* ============ TÍNH ĐIỂM ============ */
window.getRespPoint = function(stt) {
    const pos = STATE.positions[stt] || '';
    if (!pos) return 0;
    const role = STATE.respRoles.find(r => r.name === pos);
    return role ? (parseInt(role.points) || 0) : 0;
};

window.calculatePenalty = function(basePen, count) {
    let total = 0, cur = basePen;
    for (let i = 0; i < count; i++) { total += cur; cur *= 2; }
    return total;
};

window.calculateScore = function(stt, dataObj, week) {
    let total = 100 + getRespPoint(stt);
    if (!dataObj) return total;
    ERROR_TYPES.forEach(err => {
        const count = dataObj[err.key] || 0;
        if (count <= 0) return;
        if (err.weekly) {
            total += (err.isBonus ? Math.abs(err.pen) : -Math.abs(err.pen));
            return;
        }
        if (err.pen === 'custom_add') { total += count; return; }
        if (err.pen === 'custom_sub') { total -= count; return; }
        if (typeof err.pen === 'number' && err.pen < 0) {
            total += Math.abs(err.pen) * count;
        } else {
            total -= calculatePenalty(err.pen, count);
        }
    });
    return total;
};

/* ============ XẾP LOẠI (theo PDF mới) ============ */
window.evaluateMonth = function(stt, monthName) {
    const weeks = MONTH_WEEKS[monthName] || [];
    const scores = [];
    weeks.forEach(w => {
        const wk = "Tuần " + w;
        if (isStudentWeekSubmitted(stt, wk)) {
            const wd = STATE.emulation[wk]?.[stt] || {};
            scores.push(calculateScore(stt, wd, wk));
        }
    });
    if (!scores.length) return { avg: '--', minW: '--', grade: '--' };
    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = sum / scores.length;
    const minW = Math.min(...scores);
    let grade = "CHƯA ĐẠT";
    if (avg >= 90 && minW >= 80) grade = "TỐT";
    else if (avg >= 80 && minW >= 65) grade = "KHÁ";
    else if (avg >= 50) grade = "ĐẠT";
    return { avg: parseFloat(avg.toFixed(1)), minW, grade };
};

window.getGradeForPeriod = function(stt, period) {
    if (STATE.officialGrades[period]?.[stt] && STATE.officialGrades[period][stt] !== '--') {
        return STATE.officialGrades[period][stt];
    }
    if (period.startsWith("Tháng")) return evaluateMonth(stt, period).grade;
    if (period.startsWith("Học Kỳ")) return evaluateSemester(stt, period);
    if (period === "Cả Năm") return evaluateYear(stt);
    return '--';
};

window.evaluateSemester = function(stt, semName) {
    const months = semName === "Học Kỳ 1"
        ? ["Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"]
        : ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5"];
    const grades = months.map(m => getGradeForPeriod(stt, m)).filter(g => g && g !== '--');
    if (!grades.length) return '--';
    const tot = grades.filter(g => g === 'TỐT').length;
    const kha = grades.filter(g => g === 'KHÁ').length;
    const dat = grades.filter(g => g === 'ĐẠT').length;
    const cd = grades.filter(g => g === 'CHƯA ĐẠT').length;
    if (tot >= 3 && grades.every(g => g === 'TỐT' || g === 'KHÁ')) return 'TỐT';
    if ((tot + kha) >= 3 && grades.every(g => g !== 'CHƯA ĐẠT')) return 'KHÁ';
    if ((tot + kha + dat) >= 3 && cd === 0) return 'ĐẠT';
    return 'CHƯA ĐẠT';
};

window.evaluateYear = function(stt) {
    const hk1 = getGradeForPeriod(stt, "Học Kỳ 1");
    const hk2 = getGradeForPeriod(stt, "Học Kỳ 2");
    if (!hk1 || hk1 === '--' || !hk2 || hk2 === '--') return '--';
    if ((hk1 === 'TỐT' && hk2 === 'TỐT') || (hk1 === 'KHÁ' && hk2 === 'TỐT')) return 'TỐT';
    if ((hk1 === 'KHÁ' && hk2 === 'KHÁ') || (hk1 === 'TỐT' && hk2 === 'KHÁ') || (hk1 === 'ĐẠT' && hk2 === 'KHÁ')) return 'KHÁ';
    if ((hk1 === 'ĐẠT' && hk2 === 'ĐẠT') || hk2 === 'ĐẠT') return 'ĐẠT';
    return 'CHƯA ĐẠT';
};

/* ============ DEADLINES ============ */
window.getWeekDeadlines = function(wNum) {
    const weekName = "Tuần " + wNum;
    const ov = STATE.weekDeadlines?.[weekName];
    if (ov?.submitDeadline) {
        const sub = new Date(ov.submitDeadline);
        let lock = ov.lockDeadline ? new Date(ov.lockDeadline) : null;
        if (!lock || isNaN(lock.getTime())) {
            lock = new Date(sub);
            lock.setDate(sub.getDate() + 3);
        }
        if (!isNaN(sub.getTime())) return { submitDeadline: sub, lockDeadline: lock };
    }
    let startDateStr = STATE.config?.startDate || "2026-09-07";
    let startDate = new Date(startDateStr);
    if (isNaN(startDate.getTime())) startDate = new Date("2026-09-07");
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + (wNum - 1) * 7);
    const dDay = STATE.config?.deadlineDay ?? 1;
    const dHour = STATE.config?.deadlineHour ?? 23;
    const startDay = startDate.getDay();
    let offset = dDay - startDay;
    if (offset <= 0) offset += 7;
    const submit = new Date(weekStart);
    submit.setDate(weekStart.getDate() + offset);
    submit.setHours(dHour, 0, 0, 0);
    const lock = new Date(submit);
    lock.setDate(submit.getDate() + 3);
    return { submitDeadline: submit, lockDeadline: lock };
};

window.isDeadlinePassed = function(weekName) {
    try {
        const m = weekName?.match(/\d+/);
        if (!m) return false;
        const d = getWeekDeadlines(parseInt(m[0]));
        return new Date() > d.submitDeadline;
    } catch(e) { return false; }
};

window.isStudentWeekSubmitted = function(stt, weekName) {
    const wd = STATE.emulation[weekName];
    if (!wd) return false;
    if (wd['loptruong_submitted']) return true;
    for (let g = 1; g <= 4; g++) {
        if (getGroupMembers(g).includes(stt)) return !!wd['to' + g + '_submitted'];
    }
    return !!(wd['to1_submitted'] || wd['to2_submitted'] || wd['to3_submitted'] || wd['to4_submitted'] || wd[stt] !== undefined);
};

window.updateDeadlineUI = function() {
    const sel = document.getElementById('input-week-select');
    if (!sel) return;
    const m = sel.value.match(/\d+/);
    const wNum = m ? parseInt(m[0]) : 1;
    const { submitDeadline, lockDeadline } = getWeekDeadlines(wNum);
    const box = document.getElementById('deadline-info-display');
    if (!box) return;
    const fmt = d => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} (${String(d.getHours()).padStart(2,'0')}:00)`;
    box.innerHTML = `
        <div style="font-size:0.85rem; line-height:1.4; color:#1e293b;">
            <div><strong>Hạn chót nộp điểm:</strong> <span style="color:#b91c1c;">Trước ${fmt(submitDeadline)}</span></div>
            <div><strong>Khóa hệ thống:</strong> <span style="color:#475569;">${fmt(lockDeadline)}</span></div>
        </div>`;
};

/* ============ AUTH - MẬT KHẨU ============ */
window.hashPassword = async function(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + PW_SALT);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
};

window.selectRole = function(role) {
    window.currentInputRole = role;
    document.querySelectorAll('.role-card').forEach(b => b.classList.toggle('active', b.dataset.role === role));
    document.getElementById('group-select-wrapper').style.display = (role === 'totruong') ? 'flex' : 'none';
    resetInputAuth();
};

window.resetInputAuth = function() {
    const pass = document.getElementById("group-pass-input");
    if (pass) pass.value = "";
    const mem = document.getElementById("group-member-entry-container");
    if (mem) mem.style.display = "none";
    const duty = document.getElementById("duty-entry-container");
    if (duty) duty.style.display = "none";
    const lock = document.getElementById("lock-status-alert");
    if (lock) lock.style.display = "none";
    updateDeadlineUI();
};

window.verifyAuthAndRender = async function() {
    const role = window.currentInputRole || 'totruong';
    const pass = document.getElementById("group-pass-input").value.trim();
    const groupId = document.getElementById("select-group-id").value;

    let isAuthOk = false;
    let authKey = '';

    if (role === 'loptruong') authKey = 'loptruong';
    else if (role === 'lophoLĐ') authKey = 'lophoLĐ';
    else authKey = 'to' + groupId;

    const stored = STATE.passwords?.[authKey];
    if (stored?.hash) {
        const h = await hashPassword(pass);
        isAuthOk = (h === stored.hash);
    } else {
        const defaults = { loptruong: '1234', lophoLĐ: '5555' };
        const def = defaults[authKey] || String(groupId).repeat(4);
        isAuthOk = (pass === def);
    }

    if (!isAuthOk) {
        alert("Mật khẩu không đúng!");
        return;
    }

    if (role === 'lophoLĐ') {
        renderDutyForm();
        return;
    }

    const selectedWeek = document.getElementById("input-week-select").value;
    const weekNum = parseInt(selectedWeek.replace("Tuần ", "")) || 1;
    const { submitDeadline, lockDeadline } = getWeekDeadlines(weekNum);
    const today = new Date();
    const isPast = today > submitDeadline;
    const isLocked = today > lockDeadline;

    const weekData = STATE.emulation[selectedWeek] || {};
    const isSubmitted = (role === 'loptruong') ? weekData['loptruong_submitted'] : weekData['to' + groupId + '_submitted'];

    const alertBox = document.getElementById("lock-status-alert");
    alertBox.style.display = "block";

    const fmt = d => {
        if (isNaN(d.getTime())) return "...";
        return `${d.getHours()}h${String(d.getMinutes()).padStart(2,'0')} ngày ${d.getDate()}/${d.getMonth()+1}`;
    };

    if (isLocked) {
        alertBox.style.background = "#fee2e2";
        alertBox.style.color = "#991b1b";
        alertBox.innerHTML = `ĐÃ KHÓA SỔ: Quá hạn đối soát (${fmt(lockDeadline)}).`;
    } else if (isSubmitted) {
        alertBox.style.background = "#eff6ff";
        alertBox.style.color = "#1e40af";
        alertBox.innerHTML = `Đã gửi báo cáo (đến ${fmt(lockDeadline)}).`;
    } else if (isPast) {
        alertBox.style.background = "#fffbeb";
        alertBox.style.color = "#b45309";
        alertBox.innerHTML = `ĐÃ QUÁ HẠN NỘP (${fmt(submitDeadline)}).`;
    } else {
        alertBox.style.background = "#dcfce7";
        alertBox.style.color = "#166534";
        alertBox.innerHTML = `Đúng hạn (Hạn chót: ${fmt(submitDeadline)}).`;
    }

    renderInputPanel(role === 'loptruong' ? null : groupId, isLocked);
};

window.finalizeReport = function(groupId) {
    const week = document.getElementById("input-week-select").value;
    if (!confirm(`Xác nhận nộp báo cáo ${week}?`)) return;
    if (!STATE.emulation[week]) STATE.emulation[week] = {};
    if (groupId) {
        STATE.emulation[week]['to' + groupId + '_submitted'] = true;
    } else {
        STATE.emulation[week]['loptruong_submitted'] = true;
    }
    saveData('emulation', STATE.emulation);
    alert("Đã nộp báo cáo!");
    verifyAuthAndRender();
};

/* ============ NHÓM HỌC SINH ============ */
window.getGroupMembers = function(groupId) {
    groupId = parseInt(groupId);
    const members = [];
    if (STATE.studentGroups) {
        for (let stt = 1; stt <= STATE.students.length; stt++) {
            const g = STATE.studentGroups[stt];
            if (g && parseInt(String(g).replace(/\D/g, '')) === groupId) members.push(stt);
        }
    }
    if (!members.length && STATE.map) {
        for (let i = 1; i <= 48; i++) {
            const stt = STATE.map['pos_' + i];
            if (stt) {
                const colIdx = ((i - 1) % 4) + 1;
                const gNum = STATE.groupLabelSwap[colIdx] || colIdx;
                if (parseInt(gNum) === groupId) members.push(stt);
            }
        }
    }
    return members;
};

/* ============ MẬT KHẨU - QUẢN LÝ ============ */
window._showPwState = {};
window._showPwAll = false;

window.renderPasswordManager = function() {
    const container = document.getElementById('password-manager-container');
    if (!container) return;

    let html = '<div class="table-responsive" style="max-height:none;"><table style="min-width:0;"><thead><tr style="background:#fef3c7;color:#92400e;">'
        + '<th style="width:110px;">Vai trò</th>'
        + '<th style="text-align:left;">Mật khẩu hiện tại</th>'
        + '<th style="width:180px;">Đặt mật khẩu mới</th>'
        + '<th style="width:70px;">Lưu</th>'
        + '</tr></thead><tbody>';

    PW_ROLES.forEach(role => {
        const info = STATE.passwords[role.key] || {};
        const hasPw = !!info.hash;
        const showState = window._showPwAll || window._showPwState[role.key];
        const displayPw = hasPw
            ? (info.plain ? (showState ? info.plain : '•'.repeat(Math.min(info.plain.length, 12))) : '(mã hóa)')
            : '<span style="color:#dc2626;font-style:italic;">Chưa đặt</span>';
        const eyeBtn = (hasPw && info.plain)
            ? `<button onclick="togglePwShow('${role.key}')" style="background:none;border:none;cursor:pointer;color:#d97706;font-size:0.9rem;padding:2px 6px;">${showState ? 'Ẩn' : 'Xem'}</button>`
            : '';
        html += '<tr>'
            + `<td style="font-weight:800;color:#1e293b;text-align:center;">${role.icon} ${role.label}</td>`
            + `<td style="font-family:monospace;background:#fffbeb;"><span style="font-weight:700;color:#92400e;letter-spacing:2px;">${displayPw}</span>${eyeBtn}</td>`
            + `<td><input type="text" id="pw-new-${role.key}" placeholder="Pass mới..." style="width:100%;padding:6px;border:1.5px solid #cbd5e1;border-radius:6px;font-family:monospace;font-size:0.82rem;"></td>`
            + `<td style="text-align:center;"><button class="btn-action" style="background:#f59e0b;padding:5px 10px;font-size:0.72rem;" onclick="saveOnePassword('${role.key}')">Lưu</button></td>`
            + '</tr>';
    });

    html += '</tbody></table></div>'
        + '<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">'
        + `<button class="btn-action btn-gray" style="padding:6px 12px;font-size:0.78rem;" onclick="togglePwAll()">${window._showPwAll ? 'Ẩn' : 'Hiện'} tất cả</button>`
        + '<button class="btn-action btn-red" style="padding:6px 12px;font-size:0.78rem;" onclick="resetAllPasswords()">Về mặc định</button>'
        + '</div>'
        + '<div id="pw-manager-status" style="margin-top:8px;font-size:0.82rem;"></div>';

    container.innerHTML = html;
};

window.togglePwShow = function(key) {
    window._showPwState[key] = !window._showPwState[key];
    renderPasswordManager();
};

window.togglePwAll = function() {
    window._showPwAll = !window._showPwAll;
    renderPasswordManager();
};

window.saveOnePassword = async function(key) {
    const input = document.getElementById('pw-new-' + key);
    const newPw = (input.value || '').trim();
    const status = document.getElementById('pw-manager-status');
    if (!newPw) { status.innerHTML = '<span style="color:#dc2626;">Chưa nhập mật khẩu!</span>'; return; }
    if (newPw.length < 4) { status.innerHTML = '<span style="color:#dc2626;">Mật khẩu phải từ 4 ký tự!</span>'; return; }
    const hash = await hashPassword(newPw);
    STATE.passwords[key] = { hash, plain: newPw, updatedAt: new Date().toISOString() };
    saveData('passwords', STATE.passwords);
    input.value = '';
    renderPasswordManager();
    document.getElementById('pw-manager-status').innerHTML = '<span style="color:#16a34a;font-weight:700;">Đã lưu!</span>';
};

window.resetAllPasswords = async function() {
    if (!confirm('Đặt lại TẤT CẢ mật khẩu về mặc định?')) return;
    for (const role of PW_ROLES) {
        const hash = await hashPassword(role.default);
        STATE.passwords[role.key] = { hash, plain: role.default, updatedAt: new Date().toISOString() };
    }
    saveData('passwords', STATE.passwords);
    renderPasswordManager();
    document.getElementById('pw-manager-status').innerHTML = '<span style="color:#16a34a;">Đã đặt lại mặc định!</span>';
};

/* ============ CHỨC VỤ & ĐIỂM CỘNG ============ */
window.renderRespRoles = function() {
    const container = document.getElementById('resp-roles-container');
    if (!container) return;

    let html = '<div style="background:#fef3c7; border:1.5px solid #f59e0b; border-radius:10px; padding:12px; margin-bottom:14px;">';
    html += '<p style="font-size:0.82rem; color:#78350f; margin-bottom:10px;">Thêm/xóa/sửa chức vụ. Điểm sẽ được cộng mỗi tuần cho HS giữ chức vụ đó.</p>';
    html += '<div id="resp-roles-list" style="margin-bottom:10px;">';

    STATE.respRoles.forEach((role, idx) => {
        html += `<div style="display:flex; align-items:center; gap:6px; background:#fff; padding:8px; border-radius:6px; border:1px solid #fcd34d; margin-bottom:6px;">
            <input type="text" value="${role.name.replace(/"/g,'&quot;')}" onchange="updateRoleName(${idx}, this.value)" style="flex:1; padding:6px; border:1.5px solid #f59e0b; border-radius:5px; font-weight:700; color:#92400e; font-size:0.85rem;">
            <input type="number" value="${role.points}" min="0" max="100" onchange="updateRolePoints(${idx}, this.value)" style="width:70px; padding:6px; border:1.5px solid #f59e0b; border-radius:5px; text-align:center; font-weight:800; color:#92400e;">
            <span style="font-size:0.75rem; color:#78350f; font-weight:700;">đ/tuần</span>
            <button type="button" onclick="deleteRole(${idx})" style="background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; padding:6px 10px; border-radius:5px; font-weight:700; cursor:pointer;">Xóa</button>
        </div>`;
    });

    html += '</div>';
    html += '<div style="display:flex; gap:6px; margin-bottom:10px;">';
    html += '<input type="text" id="new-role-name" placeholder="Tên chức vụ mới..." style="flex:1; padding:8px; border:1.5px solid #f59e0b; border-radius:6px; font-size:0.85rem;">';
    html += '<input type="number" id="new-role-points" placeholder="Điểm" value="10" min="0" max="100" style="width:80px; padding:8px; border:1.5px solid #f59e0b; border-radius:6px; text-align:center; font-weight:700;">';
    html += '<button type="button" onclick="addRole()" style="background:#16a34a; color:#fff; border:none; padding:8px 14px; border-radius:6px; font-weight:700; cursor:pointer;">Thêm</button>';
    html += '</div>';
    html += '</div>';

    container.innerHTML = html;
};

window.addRole = function() {
    const name = document.getElementById('new-role-name').value.trim();
    const points = parseInt(document.getElementById('new-role-points').value) || 0;
    if (!name) return alert('Nhập tên chức vụ!');
    if (STATE.respRoles.some(r => r.name.toLowerCase() === name.toLowerCase())) return alert('Chức vụ đã tồn tại!');
    STATE.respRoles.push({ name, points });
    saveData('respRoles', STATE.respRoles);
    renderRespRoles();
    renderAdminStudentManager();
};

window.deleteRole = function(idx) {
    const role = STATE.respRoles[idx];
    if (!role) return;
    let count = 0;
    Object.keys(STATE.positions).forEach(stt => { if (STATE.positions[stt] === role.name) count++; });
    let msg = `Xóa chức vụ "${role.name}"?`;
    if (count > 0) msg += `\n\nCó ${count} HS đang giữ chức vụ này.`;
    if (!confirm(msg)) return;
    STATE.respRoles.splice(idx, 1);
    saveData('respRoles', STATE.respRoles);
    renderRespRoles();
    renderAdminStudentManager();
};

window.updateRoleName = function(idx, newName) {
    newName = newName.trim();
    if (!newName) return alert('Tên không được rỗng!');
    const oldName = STATE.respRoles[idx].name;
    if (oldName === newName) return;
    Object.keys(STATE.positions).forEach(stt => {
        if (STATE.positions[stt] === oldName) STATE.positions[stt] = newName;
    });
    saveData('positions', STATE.positions);
    STATE.respRoles[idx].name = newName;
    saveData('respRoles', STATE.respRoles);
    renderAdminStudentManager();
};

window.updateRolePoints = function(idx, val) {
    let p = parseInt(val);
    if (isNaN(p) || p < 0) p = 0;
    if (p > 100) p = 100;
    STATE.respRoles[idx].points = p;
    saveData('respRoles', STATE.respRoles);
};

console.log('%c[OK] CORE LOADED (Phần 2/4)', 'color:#16a34a; font-weight:bold; font-size:14px;');

/* ============================================================
   PHẦN 3A: TAB 1 — TRANG CHỦ
============================================================ */

/* ============ CSS CHÈN ĐỘNG ============ */
(function(){
    const style = document.createElement('style');
    style.textContent = `
        .stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; }
        .stats-grid > div { min-width:0; }
        .stats-grid table { width:100%; table-layout:fixed; }
        .stats-grid table td, .stats-grid table th { word-break:break-word; overflow-wrap:anywhere; }
        .stats-grid table td:last-child, .stats-grid table th:last-child { width:70px; text-align:center; }
        @media (max-width:700px) {
            .stats-grid { grid-template-columns:1fr; }
            .stats-grid table td, .stats-grid table th { padding:8px 6px !important; font-size:0.82rem !important; }
        }
        .score-detail-table { width:100%; border-collapse:collapse; font-size:0.82rem; table-layout:fixed; }
        .score-detail-table th, .score-detail-table td { padding:8px 6px; border:1px solid #cbd5e1; word-break:break-word; line-height:1.35; vertical-align:middle; }
        .score-detail-table th:last-child, .score-detail-table td:last-child { width:80px; text-align:center; white-space:nowrap; font-weight:700; }
        .score-detail-table tr.total-row td { background:#fef08a; font-weight:800; font-size:0.9rem; }
        .score-detail-header { background:linear-gradient(135deg,#1e40af,#2563eb); color:#fff; padding:10px 14px; border-radius:8px; margin-bottom:10px; font-weight:800; font-size:0.92rem; display:flex; justify-content:space-between; align-items:center; gap:8px; }
        .score-detail-header .week { background:rgba(255,255,255,0.25); padding:3px 10px; border-radius:12px; font-size:0.75rem; white-space:nowrap; }
        @media (max-width:600px) {
            #detailModal .auth-card { max-width:96vw !important; width:96vw !important; max-height:85vh !important; padding:14px !important; }
        }
    `;
    document.head.appendChild(style);
})();

/* ============ SƠ ĐỒ LỚP ============ */
window.getColMap = function() {
    if (STATE.seatingLayout === '2x2x12') {
        return {
            1: [1,2,3,4, 5,6,7,8, 9,10,11,12],
            2: [13,14,15,16, 17,18,19,20, 21,22,23,24],
            3: [25,26,27,28, 29,30,31,32, 33,34,35,36],
            4: [37,38,39,40, 41,42,43,44, 45,46,47,48]
        };
    }
    return {
        1: [1,5,9,13,17,21,25,29,33,37,41,45],
        2: [2,6,10,14,18,22,26,30,34,38,42,46],
        3: [3,7,11,15,19,23,27,31,35,39,43,47],
        4: [4,8,12,16,20,24,28,32,36,40,44,48]
    };
};

window.saveSeatingLayout = function(layout) {
    STATE.seatingLayout = layout;
    saveData('seatingLayout', layout);
};

window.createSeatingGridHTML = function(isAdmin) {
    const labelSwap = STATE.groupLabelSwap || { 1:1, 2:2, 3:3, 4:4 };

    const renderSeat = p => {
        const stt = STATE.map['pos_' + p];
        const name = stt ? STATE.students[stt - 1] : "";
        const role = stt ? (STATE.positions[stt] || "") : "";
        const roleBadge = role ? `<div style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);font-size:0.55rem;color:#fff;background:#ef4444;border-radius:10px;padding:2px 8px;font-weight:bold;white-space:nowrap;z-index:5;">${role}</div>` : '';
        const extraClass = !stt ? 'empty-seat' : '';
        const onclick = isAdmin ? `onclick="selectSeatForSwap(${p})"` : '';
        return `<div class="seat-box ${extraClass}" id="seat-${isAdmin?'admin':'public'}-${p}" ${onclick} style="position:relative;margin-top:8px;border:2px solid #94a3b8;width:100%;min-width:65px;max-width:80px;height:50px;display:flex;align-items:center;justify-content:center;">
            ${roleBadge}
            <div class="seat-name" style="text-align:center;font-size:0.6rem;width:100%;padding:0 2px;">${name || "Trống"}</div>
        </div>`;
    };

    let html = '';

    if (STATE.seatingLayout === '2x2x12') {
        const renderBlock = (title, cls, posList) => {
            let rows = '';
            for (let r = 0; r < 3; r++) {
                rows += '<div style="display:flex; gap:6px; justify-content:center; margin-bottom:6px;">';
                for (let c = 0; c < 4; c++) rows += renderSeat(posList[r * 4 + c]);
                rows += '</div>';
            }
            return `<div class="${cls}" style="padding:10px; border-radius:10px; background:#fff; margin-bottom:10px;">
                <div style="text-align:center; font-weight:900; font-size:0.85rem; text-transform:uppercase; margin-bottom:10px; padding:4px; border-radius:6px; background:rgba(0,0,0,0.04);">${title}</div>
                ${rows}</div>`;
        };
        const g1 = labelSwap[1], g2 = labelSwap[2], g3 = labelSwap[3], g4 = labelSwap[4];
        html += '<div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center; width:100%;">';
        html += '<div style="flex:1; min-width:340px; border:2px solid #bfdbfe; border-radius:12px; padding:10px; background:#f0f9ff;">';
        html += '<div style="text-align:center; font-weight:900; color:#1e40af; font-size:0.9rem; margin-bottom:10px;">DÃY 1</div>';
        html += renderBlock("Tổ " + g1, "group-tto-" + g1, [1,2,3,4,5,6,7,8,9,10,11,12]);
        html += renderBlock("Tổ " + g3, "group-tto-" + g3, [25,26,27,28,29,30,31,32,33,34,35,36]);
        html += '</div>';
        html += '<div style="flex:1; min-width:340px; border:2px solid #fde68a; border-radius:12px; padding:10px; background:#fffbeb;">';
        html += '<div style="text-align:center; font-weight:900; color:#b45309; font-size:0.9rem; margin-bottom:10px;">DÃY 2</div>';
        html += renderBlock("Tổ " + g2, "group-tto-" + g2, [13,14,15,16,17,18,19,20,21,22,23,24]);
        html += renderBlock("Tổ " + g4, "group-tto-" + g4, [37,38,39,40,41,42,43,44,45,46,47,48]);
        html += '</div></div>';
    } else {
        const renderCol = (title, cls, pList) => {
            let seats = '';
            for (let i = 0; i < pList.length; i += 2) {
                seats += `<div style="display:flex; gap:6px; justify-content:center; margin-bottom:6px;">${renderSeat(pList[i])}${pList[i+1] ? renderSeat(pList[i+1]) : ''}</div>`;
            }
            return `<div class="${cls}" style="flex:1; min-width:150px; padding:10px; border-radius:10px; background:#fff; display:flex; flex-direction:column;">
                <div style="text-align:center; font-weight:900; font-size:0.85rem; text-transform:uppercase; margin-bottom:12px; padding:4px; border-radius:6px; background:rgba(0,0,0,0.04);">${title}</div>
                ${seats}</div>`;
        };
        const cols = getColMap();
        html += '<div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center; width:100%;">';
        for (let c = 1; c <= 4; c++) {
            const gId = labelSwap[c] || c;
            html += renderCol("Tổ " + gId, "group-tto-" + gId, cols[c]);
        }
        html += '</div>';
    }
    return html;
};

window.renderSeatingMap = function() {
    const container = document.getElementById("seating-map-grid-container");
    if (container) container.innerHTML = createSeatingGridHTML(false);
    const mobileContainer = document.getElementById("mobile-seating-map");
    if (mobileContainer) mobileContainer.innerHTML = createSeatingGridHTML(false);
    const w = document.getElementById("seating-week-select");
    const label = document.getElementById("seating-week-label");
    if (w && label) label.innerText = `Đang xem: ${w.value}`;
};

window.renderAdminSeatingMap = function() {
    const container = document.getElementById("admin-seating-map-grid-container");
    if (!container) return;
    container.innerHTML = createSeatingGridHTML(true);
};

window.selectSeatForSwap = function(pos) {
    if (!window.selectedPosForSwap) {
        window.selectedPosForSwap = pos;
        const el = document.getElementById(`seat-admin-${pos}`);
        if (el) el.classList.add('selected-seat');
    } else {
        const p1 = window.selectedPosForSwap;
        const p2 = pos;
        const tmp = STATE.map['pos_' + p1];
        STATE.map['pos_' + p1] = STATE.map['pos_' + p2];
        STATE.map['pos_' + p2] = tmp;
        saveData('map', STATE.map);
        window.selectedPosForSwap = null;
        renderSeatingMap();
        renderAdminSeatingMap();
    }
};

window.autoMapStudentsByGroup = function() {
    const newMap = {};
    for (let i = 1; i <= 48; i++) newMap['pos_' + i] = null;
    const groups = { 1:[], 2:[], 3:[], 4:[], "Chưa chọn":[] };
    STATE.students.forEach((_, idx) => {
        const stt = idx + 1;
        const gStr = STATE.studentGroups?.[stt] || "";
        const gNum = parseInt(String(gStr).replace(/\D/g, ''));
        if (gNum >= 1 && gNum <= 4) groups[gNum].push(stt);
        else groups["Chưa chọn"].push(stt);
    });
    const labelSwap = STATE.groupLabelSwap || { 1:1, 2:2, 3:3, 4:4 };
    const colMap = getColMap();
    for (let c = 1; c <= 4; c++) {
        const gId = labelSwap[c] || c;
        const members = groups[gId] || [];
        members.forEach((stt, i) => {
            if (i < colMap[c].length) newMap['pos_' + colMap[c][i]] = stt;
        });
    }
    const unassigned = [...groups["Chưa chọn"]];
    for (let i = 1; i <= 48; i++) {
        if (!newMap['pos_' + i] && unassigned.length) newMap['pos_' + i] = unassigned.shift();
    }
    STATE.map = newMap;
    saveData('map', STATE.map);
    renderSeatingMap();
    renderAdminSeatingMap();
};

window.swapEntireGroups = function() {
    const g1 = parseInt(document.getElementById("swap-group-1").value);
    const g2 = parseInt(document.getElementById("swap-group-2").value);
    if (g1 === g2) return alert("Vui lòng chọn 2 tổ khác nhau!");
    const labelSwap = STATE.groupLabelSwap || { 1:1, 2:2, 3:3, 4:4 };
    let col1 = null, col2 = null;
    for (let c = 1; c <= 4; c++) {
        if (parseInt(labelSwap[c]) === g1) col1 = c;
        if (parseInt(labelSwap[c]) === g2) col2 = c;
    }
    if (!col1 || !col2) {
        STATE.groupLabelSwap = { 1:1, 2:2, 3:3, 4:4 };
        saveData('groupLabelSwap', STATE.groupLabelSwap);
        if (typeof autoMapStudentsByGroup === 'function') autoMapStudentsByGroup();
        return alert("Dữ liệu cũ bị kẹt. Đã tự sửa, chọn lại!");
    }
    const tmp = labelSwap[col1];
    labelSwap[col1] = labelSwap[col2];
    labelSwap[col2] = tmp;
    STATE.groupLabelSwap = labelSwap;
    saveData('groupLabelSwap', STATE.groupLabelSwap);

    const colMap = getColMap();
    const seats1 = colMap[col1], seats2 = colMap[col2];
    const newMap = { ...STATE.map };
    for (let i = 0; i < Math.max(seats1.length, seats2.length); i++) {
        const p1 = seats1[i], p2 = seats2[i];
        if (p1 === undefined || p2 === undefined) continue;
        const s1 = newMap['pos_' + p1], s2 = newMap['pos_' + p2];
        newMap['pos_' + p1] = (s2 !== undefined) ? s2 : null;
        newMap['pos_' + p2] = (s1 !== undefined) ? s1 : null;
    }
    STATE.map = newMap;
    saveData('map', STATE.map);
    renderSeatingMap();
    renderAdminSeatingMap();
    alert(`Đã đổi chỗ Tổ ${g1} ↔ Tổ ${g2}!`);
};

window.autoSuggestSeating = function() {
    if (!confirm("Gợi ý xếp chỗ: BCS rải đều + ngẫu nhiên. Ghi đè sơ đồ hiện tại?")) return;
    const allStts = Array.from({ length: STATE.students.length }, (_, i) => i + 1);
    const bcs = allStts.filter(stt => STATE.positions[stt]);
    const others = allStts.filter(stt => !STATE.positions[stt]);
    const newMap = {};
    for (let i = 1; i <= 48; i++) newMap['pos_' + i] = null;
    const bcsPos = [];
    for (let r = 1; r <= 3; r++) for (let c = 1; c <= 4; c++) bcsPos.push((r-1)*4 + c);
    bcs.forEach((stt, i) => {
        if (i < bcsPos.length) newMap['pos_' + bcsPos[i]] = stt;
        else others.push(stt);
    });
    others.sort(() => Math.random() - 0.5);
    const empty = [];
    for (let i = 1; i <= 48; i++) if (!newMap['pos_' + i]) empty.push(i);
    others.forEach((stt, i) => { if (i < empty.length) newMap['pos_' + empty[i]] = stt; });
    STATE.map = newMap;
    saveData('map', STATE.map);
    renderSeatingMap();
    renderAdminSeatingMap();
};

window.autoShuffleWithinGroups = function() {
    if (!confirm("Đảo ngẫu nhiên TRONG CÙNG 1 TỔ?")) return;
    const colMap = getColMap();
    const newMap = { ...STATE.map };
    for (let c = 1; c <= 4; c++) {
        const stts = [], positions = [];
        colMap[c].forEach(p => {
            if (newMap['pos_' + p]) {
                stts.push(newMap['pos_' + p]);
                positions.push(p);
            }
        });
        stts.sort(() => Math.random() - 0.5);
        positions.forEach((p, i) => newMap['pos_' + p] = stts[i]);
    }
    STATE.map = newMap;
    saveData('map', STATE.map);
    renderSeatingMap();
    renderAdminSeatingMap();
};

window.autoShuffleAll = function() {
    if (!confirm("Đảo ngẫu nhiên TOÀN BỘ học sinh trong lớp?")) return;
    const stts = Array.from({ length: STATE.students.length }, (_, i) => i + 1);
    stts.sort(() => Math.random() - 0.5);
    const newMap = {};
    for (let i = 1; i <= 48; i++) newMap['pos_' + i] = null;
    stts.forEach((stt, i) => newMap['pos_' + (i + 1)] = stt);
    STATE.map = newMap;
    saveData('map', STATE.map);
    renderSeatingMap();
    renderAdminSeatingMap();
};

/* ============ TRỰC NHẬT (TAB 1) ============ */
window.renderPublicDuty = function() {
    const container = document.getElementById("public-duty-list");
    if (!container) return;
    const sel = document.getElementById("public-duty-week-select");
    const week = sel?.value || "Tuần 1";
    const label = document.getElementById("public-duty-week-label");
    if (label) label.innerText = `(${week})`;
    const weekDuty = STATE.duty?.[week] || {};
    const days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

    let html = '';
    days.forEach((day, i) => {
        const dayData = weekDuty[i + 1];
        let leaderStr = "", membersStr = "";
        if (dayData && typeof dayData === 'object') {
            if (dayData.leader) leaderStr = dayData.leader.replace(/^\d+\.\s*/, '');
            if (Array.isArray(dayData.members) && dayData.members.length) {
                membersStr = dayData.members.map(m => m.replace(/^\d+\.\s*/, '')).join(", ");
            }
        }
        let details = "";
        if (leaderStr) details += `<div style="color:#b45309; font-size:0.8rem; margin-bottom:3px;"><b>Trưởng nhóm:</b> ${leaderStr}</div>`;
        if (membersStr) details += `<div style="color:#334155; font-size:0.8rem;"><b>Thành viên:</b> ${membersStr}</div>`;
        if (!leaderStr && !membersStr) details = '<div style="color:#94a3b8; font-style:italic; font-size:0.8rem;">Chưa phân công</div>';
        html += `<div style="background:#fff; border:1px solid #bfdbfe; padding:10px 12px; border-radius:8px; width:100%; margin-bottom:8px;">
            <div style="font-weight:bold; color:#1e40af; font-size:0.85rem; margin-bottom:5px;">${day}</div>
            ${details}
        </div>`;
    });
    container.innerHTML = html;
};

window.renderPublicDutyMobile = function() {
    const container = document.getElementById("public-duty-list-mobile");
    if (!container) return;
    const sel = document.getElementById("mobile-duty-week-select");
    const week = sel?.value || "Tuần 1";
    const weekDuty = STATE.duty?.[week] || {};
    const days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

    let html = '';
    days.forEach((day, i) => {
        const dayData = weekDuty[i + 1];
        let leaderStr = "", membersArr = [];
        if (dayData && typeof dayData === 'object') {
            if (dayData.leader) leaderStr = dayData.leader.replace(/^\d+\.\s*/, '');
            if (Array.isArray(dayData.members)) membersArr = dayData.members.map(m => m.replace(/^\d+\.\s*/, ''));
        }
        html += `<div class="duty-mobile-card"><div class="duty-mobile-header">${day.toUpperCase()}</div><div class="duty-mobile-body">`;
        if (!leaderStr && !membersArr.length) {
            html += '<div class="duty-mobile-empty">Chưa phân công</div>';
        } else {
            if (leaderStr) html += `<div class="duty-mobile-leader"><div style="flex:1;"><div class="duty-mobile-label">Trưởng nhóm</div><div class="duty-mobile-name">${leaderStr}</div></div></div>`;
            if (membersArr.length) html += `<div class="duty-mobile-members"><div style="flex:1;"><div class="duty-mobile-label">Thành viên (${membersArr.length})</div><div class="duty-mobile-names">${membersArr.join(", ")}</div></div></div>`;
        }
        html += `</div></div>`;
    });
    container.innerHTML = html;
};

/* ============ TKB (TAB 1) ============ */
window.renderTkbPublic = function() {
    const THU = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const box = document.getElementById('tkb-public-table');
    const mobileBox = document.getElementById('tkb-public-mobile');
    if (!box && !mobileBox) return;

    let has = false;
    STATE.tkb.data.forEach(r => r.forEach(c => { if (c.mon) has = true; }));
    if (!has) {
        const empty = '<div style="text-align:center;padding:20px;color:#94a3b8;font-style:italic;font-size:0.85rem;">Chưa có thời khóa biểu.</div>';
        if (box) box.innerHTML = empty;
        if (mobileBox) mobileBox.innerHTML = empty;
        return;
    }

    let html = '<div style="overflow-x:auto;border-radius:8px;">';
    html += '<table style="width:100%;border-collapse:collapse;font-size:0.85rem;min-width:700px;">';
    html += '<thead><tr><th style="background:#dc2626;color:#fff;padding:10px 8px;border:1px solid #cbd5e1;width:80px;">TIẾT</th>';
    THU.forEach(t => html += '<th style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff;padding:10px 8px;border:1px solid #cbd5e1;">' + t.toUpperCase() + '</th>');
    html += '</tr></thead><tbody>';
    for (let r = 0; r < STATE.tkb.numTiet; r++) {
        html += '<tr><td style="background:#fef2f2;color:#991b1b;font-weight:800;padding:8px;border:1px solid #cbd5e1;text-align:center;">Tiết ' + (r+1) + '</td>';
        for (let c = 0; c < 6; c++) {
            const cell = STATE.tkb.data[r]?.[c] || { mon:'', gv:'' };
            if (cell.mon) {
                html += '<td style="padding:10px 8px;border:1px solid #e2e8f0;text-align:center;"><div style="font-weight:800;color:#1e293b;line-height:1.3;">' + cell.mon + '</div>'
                    + (cell.gv ? '<div style="color:#64748b;font-size:0.72rem;margin-top:3px;">' + cell.gv + '</div>' : '') + '</td>';
            } else {
                html += '<td style="padding:10px 8px;border:1px solid #e2e8f0;text-align:center;color:#cbd5e1;font-style:italic;">—</td>';
            }
        }
        html += '</tr>';
    }
    html += '</tbody></table></div>';
    if (box) box.innerHTML = html;

    // Mobile
    let mob = '';
    for (let d = 0; d < 6; d++) {
        let cells = [];
        for (let r = 0; r < STATE.tkb.numTiet; r++) {
            const cell = STATE.tkb.data[r]?.[d] || { mon:'', gv:'' };
            if (cell.mon) cells.push({ tiet: r+1, ...cell });
        }
        if (!cells.length) continue;
        mob += '<div style="background:#fff;border:1.5px solid #e2e8f0;border-radius:12px;margin-bottom:10px;overflow:hidden;box-shadow:0 2px 8px rgba(139,92,246,0.08);">';
        mob += '<div style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff;padding:10px 14px;font-weight:800;font-size:0.95rem;">' + THU[d].toUpperCase() + '</div>';
        cells.forEach(c => {
            mob += '<div style="display:flex;align-items:center;padding:10px 14px;border-bottom:1px solid #f1f5f9;gap:12px;">'
                + '<div style="background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff;font-weight:800;font-size:0.72rem;min-width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">T' + c.tiet + '</div>'
                + '<div style="flex:1;"><div style="font-weight:800;color:#1e293b;font-size:0.95rem;">' + c.mon + '</div>'
                + (c.gv ? '<div style="color:#64748b;font-size:0.78rem;">' + c.gv + '</div>' : '') + '</div></div>';
        });
        mob += '</div>';
    }
    if (mobileBox) mobileBox.innerHTML = mob;
};

/* ============ BẢNG ĐIỂM TỔNG HỢP (TAB 1) ============ */
window.renderPublicSummaryTable = function() {
    const mode = document.getElementById("emulation-view-mode")?.value;
    const tbody = document.getElementById("public-summary-tbody");
    const thead = document.getElementById("public-summary-thead");
    if (!tbody || !thead || !mode) return;
    tbody.innerHTML = "";

    // Bảng thống kê cộng/trừ (chỉ ở mode week)
    if (mode === 'week') {
        try {
            const box = document.getElementById("custom-summary-error-box");
            if (box) {
                const week = document.getElementById("public-week-select")?.value || "Tuần 1";
                const weekData = STATE.emulation[week] || {};
                const isOverdue = isDeadlinePassed(week);
                const violCounts = {}, bonusCounts = {};

                Object.keys(weekData).forEach(stt => {
                    const sName = STATE.students[stt - 1];
                    if (!sName || !weekData[stt]) return;
                    let viol = 0, bonus = 0;
                    ERROR_TYPES.forEach(err => {
                        const cnt = Number(weekData[stt][err.key]) || 0;
                        if (cnt > 0) {
                            if (err.key === 'cdx' || (err.pen < 0 && err.pen !== 'custom_sub')) bonus += cnt;
                            else if (err.pen === 'custom_sub') viol += 1;
                            else if (err.pen !== 'custom_add') viol += cnt;
                        }
                    });
                    if (viol > 0) violCounts[sName] = viol;
                    if (bonus > 0) bonusCounts[sName] = bonus;
                });

                STATE.students.forEach((name, idx) => {
                    const stt = idx + 1;
                    if (getRespPoint(stt) > 0 && !isStudentWeekSubmitted(stt, week) && isOverdue) {
                        violCounts[name] = (violCounts[name] || 0) + 1;
                    }
                });

                let statsHtml = `<div class="stats-grid">`;
                statsHtml += `<div style="background:#f0fdf4; border:1px solid #86efac; border-radius:6px; padding:8px;">
                    <div style="font-weight:bold; color:#166534; font-size:0.8rem; margin-bottom:6px;">Điểm cộng (${week})</div>
                    <table style="width:100%; border-collapse:collapse; font-size:0.75rem;">
                        <tr style="background:#dcfce7; color:#166534;"><th style="border:1px solid #bbf7d0; padding:6px; text-align:left;">Học sinh</th><th style="border:1px solid #bbf7d0; padding:6px; width:60px;">Lượt</th></tr>`;
                const sb = Object.keys(bonusCounts).sort((a,b) => bonusCounts[b] - bonusCounts[a]);
                statsHtml += !sb.length
                    ? `<tr><td colspan="2" style="border:1px solid #bbf7d0; padding:6px; text-align:center; font-style:italic; color:#15803d;">Chưa có.</td></tr>`
                    : sb.map(n => `<tr><td style="border:1px solid #bbf7d0; padding:6px;">${n}</td><td style="border:1px solid #bbf7d0; padding:6px; text-align:center; font-weight:bold; color:#16a34a;">+${bonusCounts[n]}</td></tr>`).join('');
                statsHtml += `</table></div>`;
                statsHtml += `<div style="background:#fef2f2; border:1px solid #fca5a5; border-radius:6px; padding:8px;">
                    <div style="font-weight:bold; color:#b91c1c; font-size:0.8rem; margin-bottom:6px;">Lỗi vi phạm (${week})</div>
                    <table style="width:100%; border-collapse:collapse; font-size:0.75rem;">
                        <tr style="background:#fee2e2; color:#991b1b;"><th style="border:1px solid #fecaca; padding:6px; text-align:left;">Học sinh</th><th style="border:1px solid #fecaca; padding:6px; width:60px;">Lỗi</th></tr>`;
                const sv = Object.keys(violCounts).sort((a,b) => violCounts[b] - violCounts[a]);
                statsHtml += !sv.length
                    ? `<tr><td colspan="2" style="border:1px solid #fecaca; padding:6px; text-align:center; font-style:italic; color:#7f1d1d;">Không có.</td></tr>`
                    : sv.map(n => `<tr><td style="border:1px solid #fecaca; padding:6px;">${n}</td><td style="border:1px solid #fecaca; padding:6px; text-align:center; font-weight:bold; color:#b91c1c;">${violCounts[n]}</td></tr>`).join('');
                statsHtml += `</table></div></div>`;
                box.innerHTML = statsHtml;
            }
        } catch(e) { console.error(e); }

        const week = document.getElementById("public-week-select").value;
        thead.innerHTML = `<tr><th style="width:40px;">STT</th><th style="min-width:140px; text-align:left;">Họ và Tên</th><th>Chức vụ</th><th style="background:#eef2ff;">Điểm tuần</th><th style="background:#fffbeb; color:#b45309;">Hạng</th><th>Chi Tiết</th></tr>`;

        const weekData = STATE.emulation[week] || {};
        const hasAny = Object.keys(weekData).length > 0;
        const hasOverdue = STATE.students.some((_, i) => getRespPoint(i+1) > 0 && !isStudentWeekSubmitted(i+1, week) && isDeadlinePassed(week));
        if (!hasAny && !hasOverdue) {
            tbody.innerHTML = `<tr><td colspan="6" style="padding:15px; color:#64748b; font-style:italic;">Tuần này chưa có dữ liệu.</td></tr>`;
            return;
        }
        const list = STATE.students.map((name, idx) => {
            const stt = idx + 1;
            const isSub = isStudentWeekSubmitted(stt, week);
            const isOfficer = getRespPoint(stt) > 0;
            const overdue = isDeadlinePassed(week);
            let total = '--';
            if (isSub || (isOfficer && overdue && !isSub)) total = calculateScore(stt, weekData[stt], week);
            return { stt, name, pos: STATE.positions[stt] || "-", total };
        }).sort((a,b) => (a.total === '--') ? 1 : (b.total === '--') ? -1 : (b.total - a.total));

        list.forEach((item, i) => {
            const posTag = item.pos !== "-" ? `<span style="background:#f0fdf4; color:#166534; padding:3px 8px; border-radius:6px; font-size:0.75rem; border:1px solid #bbf7d0; font-weight:bold;">${item.pos}</span>` : "-";
            const sc = item.total === '--' ? '<span style="color:#94a3b8; font-style:italic;">Chưa nhập</span>' : `<strong style="color:${item.total<80?'#dc2626':'#16a34a'}; font-size:1.05rem;">${item.total}</strong>`;
            const rk = item.total === '--' ? '-' : `<strong>#${i+1}</strong>`;
            const btn = item.total === '--' ? '-' : `<button onclick="openStudentDetailModal(${item.stt}, '${week}')" class="btn-action btn-primary" style="padding:4px 10px; font-size:0.75rem;">Xem</button>`;
            tbody.innerHTML += `<tr><td><strong>${item.stt}</strong></td><td style="text-align:left;">${item.name}</td><td>${posTag}</td><td style="background:#eef2ff;">${sc}</td><td style="background:#fffbeb; color:#b45309;">${rk}</td><td>${btn}</td></tr>`;
        });
        return;
    }

    const periodKey = mode === 'month' ? document.getElementById("public-month-select").value : (mode === 'semester' ? "Học Kỳ 1" : "Cả Năm");
    const finalized = STATE.officialGrades[periodKey];
    if (!finalized || !Object.keys(finalized).length) {
        thead.innerHTML = `<tr><th>Thông báo</th></tr>`;
        tbody.innerHTML = `<tr><td style="padding:20px; color:#b91c1c; font-weight:bold; font-style:italic;">GVCN chưa chốt dữ liệu cho ${periodKey}.</td></tr>`;
        return;
    }
    if (mode === 'month') {
        const weeks = MONTH_WEEKS[periodKey] || [];
        let th = `<tr><th style="width:40px;">STT</th><th style="min-width:140px;">Họ và Tên</th>`;
        weeks.forEach(w => th += `<th>T${w}</th>`);
        th += `<th style="background:#fefce8;">Điểm TB</th><th style="background:#eef2ff;">Xếp loại</th></tr>`;
        thead.innerHTML = th;
        STATE.students.forEach((name, idx) => {
            const stt = idx + 1;
            const grade = finalized[stt] || "--";
            const scores = weeks.map(w => {
                const wk = "Tuần " + w;
                return isStudentWeekSubmitted(stt, wk) ? calculateScore(stt, STATE.emulation[wk]?.[stt] || {}, wk) : null;
            }).filter(s => s !== null);
            const avg = scores.length ? (scores.reduce((a,b)=>a+b,0) / scores.length).toFixed(1) : "--";
            const td = weeks.map(w => {
                const wk = "Tuần " + w;
                const sub = isStudentWeekSubmitted(stt, wk);
                const sc = sub ? calculateScore(stt, STATE.emulation[wk]?.[stt] || {}, wk) : null;
                return `<td style="font-weight:600; color:${(!sub || sc<80)?'#dc2626':'#16a34a'}">${sc ?? '--'}</td>`;
            }).join('');
            const c = grade === 'TỐT' ? '#16a34a' : (grade === 'KHÁ' ? '#d97706' : (grade === 'ĐẠT' ? '#0284c7' : (grade === '--' ? '#94a3b8' : '#dc2626')));
            tbody.innerHTML += `<tr><td><strong>${stt}</strong></td><td style="text-align:left;">${name}</td>${td}<td style="background:#fefce8;"><strong>${avg}</strong></td><td style="background:#eef2ff;"><strong style="color:${c};">${grade}</strong></td></tr>`;
        });
    } else if (mode === 'semester') {
        thead.innerHTML = `<tr><th style="width:40px;">STT</th><th style="min-width:140px; text-align:left;">Họ và Tên</th><th style="background:#eef2ff;">HK1</th><th style="background:#f0fdf4;">HK2</th></tr>`;
        const hk1 = STATE.officialGrades["Học Kỳ 1"] || {};
        const hk2 = STATE.officialGrades["Học Kỳ 2"] || {};
        STATE.students.forEach((name, idx) => {
            const stt = idx + 1;
            const g1 = hk1[stt] || '--', g2 = hk2[stt] || '--';
            const c1 = g1==='TỐT'?'#16a34a':(g1==='KHÁ'?'#d97706':(g1==='ĐẠT'?'#0284c7':(g1==='--'?'#94a3b8':'#dc2626')));
            const c2 = g2==='TỐT'?'#16a34a':(g2==='KHÁ'?'#d97706':(g2==='ĐẠT'?'#0284c7':(g2==='--'?'#94a3b8':'#dc2626')));
            tbody.innerHTML += `<tr><td><strong>${stt}</strong></td><td style="text-align:left;">${name}</td><td style="background:#eef2ff; font-weight:bold; color:${c1};">${g1}</td><td style="background:#f0fdf4; font-weight:bold; color:${c2};">${g2}</td></tr>`;
        });
    } else {
        thead.innerHTML = `<tr><th style="width:40px;">STT</th><th style="min-width:140px; text-align:left;">Họ và Tên</th><th style="background:#fffbeb; color:#b45309;">Xếp Loại Cả Năm</th></tr>`;
        const yd = STATE.officialGrades["Cả Năm"] || {};
        STATE.students.forEach((name, idx) => {
            const stt = idx + 1;
            const g = yd[stt] || '--';
            const c = g === 'TỐT' ? '#16a34a' : (g === 'KHÁ' ? '#d97706' : (g === '--' ? '#94a3b8' : '#dc2626'));
            tbody.innerHTML += `<tr><td><strong>${stt}</strong></td><td style="text-align:left;">${name}</td><td style="background:#fffbeb;"><strong style="color:${c};">${g}</strong></td></tr>`;
        });
    }
};

/* ============ MODAL SAO KÊ ĐIỂM ============ */
window.openStudentDetailModal = function(stt, inputWeek = null) {
    const week = inputWeek || document.getElementById("public-week-select").value;
    const data = STATE.emulation[week]?.[stt] || {};
    const name = STATE.students[stt - 1];
    const respPoint = getRespPoint(stt);
    let total = 100 + respPoint;

    let html = `<div class="score-detail-header">
        <span>${name}</span>
        <span class="week">${week}</span>
    </div>
    <table class="score-detail-table">
        <thead><tr style="background:#f1f5f9;"><th>Khoản mục</th><th>Điểm</th></tr></thead>
        <tbody>
            <tr><td>Điểm gốc</td><td style="color:#334155;">100đ</td></tr>`;

    if (respPoint > 0) {
        html += `<tr><td>Điểm chức vụ</td><td style="color:#16a34a;">+${respPoint}đ</td></tr>`;
    }
    ERROR_TYPES.forEach(err => {
        const count = data[err.key] || 0;
        if (count <= 0) return;
        if (err.weekly) {
            const pts = Math.abs(err.pen) || 10;
            total += pts;
            html += `<tr><td>${err.label}</td><td style="color:#16a34a;">+${pts}đ</td></tr>`;
            return;
        }
        if (err.pen === 'custom_add') { total += count; html += `<tr><td>${err.label} (${count})</td><td style="color:#16a34a;">+${count}đ</td></tr>`; return; }
        if (err.pen === 'custom_sub') { total -= count; html += `<tr><td>${err.label} (${count})</td><td style="color:#dc2626;">-${count}đ</td></tr>`; return; }
        if (typeof err.pen === 'number' && err.pen < 0) {
            const bonus = Math.abs(err.pen) * count;
            total += bonus;
            html += `<tr><td>${err.label} (${count})</td><td style="color:#16a34a;">+${bonus}đ</td></tr>`;
        } else {
            const pen = calculatePenalty(err.pen, count);
            total -= pen;
            html += `<tr><td>${err.label} (${count})</td><td style="color:#dc2626;">-${pen}đ</td></tr>`;
        }
    });
    html += `<tr class="total-row"><td style="text-align:right;">TỔNG ĐIỂM</td><td style="color:${total >= 80 ? '#166534' : '#991b1b'};">${total}đ</td></tr>`;
    html += `</tbody></table>`;
    document.getElementById("detail-modal-content").innerHTML = html;
    document.getElementById("detailModal").classList.add("open");
};

/* ============ TRA CỨU HỒ SƠ ============ */
function buildSearchReport(stt, searchType, periodVal) {
    const name = STATE.students[stt - 1];
    let targetWeeks = [];
    if (searchType === 'week') targetWeeks = [periodVal];
    else if (periodVal.startsWith("Tháng")) targetWeeks = (MONTH_WEEKS[periodVal] || []).map(w => "Tuần " + w);
    else if (periodVal === "Học Kỳ 1") ["Tháng 9","Tháng 10","Tháng 11","Tháng 12"].forEach(m => (MONTH_WEEKS[m] || []).forEach(w => targetWeeks.push("Tuần " + w)));
    else if (periodVal === "Học Kỳ 2") ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5"].forEach(m => (MONTH_WEEKS[m] || []).forEach(w => targetWeeks.push("Tuần " + w)));
    else if (periodVal === "Cả Năm") for (let i = 1; i <= 35; i++) targetWeeks.push("Tuần " + i);

    const bonusList = [], violationList = [];
    targetWeeks.forEach(weekName => {
        const data = STATE.emulation[weekName]?.[stt] || {};
        const weekBonus = [], weekViol = [];
        ERROR_TYPES.forEach(err => {
            const count = data[err.key] || 0;
            if (count <= 0) return;
            if (err.weekly) weekBonus.push(`<b>${err.label}</b> (+${Math.abs(err.pen)}đ)`);
            else if (err.pen === 'custom_add') weekBonus.push(`<b>${err.label}</b> (+${count}đ)`);
            else if (err.pen === 'custom_sub') weekViol.push(`<b>${err.label}</b> (-${count}đ)`);
            else if (typeof err.pen === 'number' && err.pen < 0) weekBonus.push(`<b>${err.label}</b> (+${Math.abs(err.pen) * count}đ)`);
            else weekViol.push(`<b>${err.label}</b> (-${calculatePenalty(err.pen, count)}đ)`);
        });
        const tag = `<span style="color:#0ea5e9; font-weight:800; background:#e0f2fe; padding:2px 6px; border-radius:4px; font-size:0.7rem; margin-right:4px;">${weekName}</span>`;
        if (weekBonus.length) bonusList.push(`<li style="margin-bottom:8px;">${tag}${weekBonus.join(', ')}</li>`);
        if (weekViol.length) violationList.push(`<li style="margin-bottom:8px;">${tag}${weekViol.join(', ')}</li>`);
    });

    let summaryHTML = '';
    if (searchType === 'week') {
        const myScore = isStudentWeekSubmitted(stt, periodVal)
            ? calculateScore(stt, STATE.emulation[periodVal]?.[stt] || {}, periodVal)
            : null;
        summaryHTML = myScore !== null
            ? `<div style="background:linear-gradient(135deg,#1e40af,#2563eb); color:#fff; border-radius:12px; padding:20px; text-align:center; margin:12px 0;">
                <div style="font-size:0.85rem; font-weight:700; letter-spacing:1px; opacity:0.9;">TỔNG ĐIỂM ${periodVal.toUpperCase()}</div>
                <div style="font-size:2.8rem; font-weight:900; margin:6px 0;">${myScore}đ</div></div>`
            : `<div style="background:#f8fafc; border:1.5px dashed #cbd5e1; border-radius:10px; padding:14px; text-align:center; margin:12px 0; color:#64748b; font-style:italic; font-size:0.85rem;">Chưa có dữ liệu điểm cho tuần này.</div>`;
    } else {
        const finalGrade = STATE.officialGrades[periodVal]?.[stt] && STATE.officialGrades[periodVal][stt] !== '--'
            ? STATE.officialGrades[periodVal][stt] : null;
        if (!finalGrade) {
            summaryHTML = `<div style="background:#fffbeb; border:1.5px solid #d97706; border-radius:10px; padding:14px; margin:12px 0; text-align:center;">
                <div style="color:#92400e; font-weight:800; font-size:0.95rem;">Chưa có dữ liệu xếp loại ${periodVal}</div></div>`;
        } else {
            summaryHTML = `<div style="background:linear-gradient(135deg,#065f46,#16a34a); color:#fff; border-radius:12px; padding:20px; text-align:center; margin:12px 0;">
                <div style="font-size:0.85rem; font-weight:700; letter-spacing:1px; opacity:0.9;">HẠNH KIỂM ${periodVal.toUpperCase()}</div>
                <div style="font-size:2.8rem; font-weight:900; margin:6px 0;">${finalGrade}</div></div>`;
        }
    }

    let html = `<h5 style="color:#0369a1; font-size:0.95rem; margin-bottom:12px; border-bottom:1px solid #bae6fd; padding-bottom:6px;">Hồ sơ: <b>${name}</b></h5>`;
    html += summaryHTML;
    html += `<div style="display:flex; flex-wrap:wrap; gap:10px; width:100%;">`;
    html += `<div style="flex:1; min-width:240px; background:#f0fdf4; border:1.5px solid #86efac; border-radius:8px; padding:12px;">
        <div style="font-weight:bold; color:#166534; font-size:0.85rem; margin-bottom:10px; border-bottom:1px dashed #bbf7d0; padding-bottom:4px;">Điểm cộng</div>`;
    html += bonusList.length ? `<ul style="padding-left:16px; font-size:0.82rem; line-height:1.5; color:#166534;">${bonusList.join('')}</ul>` : `<div style="color:#15803d; font-style:italic; font-size:0.8rem;">Không có điểm cộng.</div>`;
    html += `</div>`;
    html += `<div style="flex:1; min-width:240px; background:#fef2f2; border:1.5px solid #fca5a5; border-radius:8px; padding:12px;">
        <div style="font-weight:bold; color:#b91c1c; font-size:0.85rem; margin-bottom:10px; border-bottom:1px dashed #fecaca; padding-bottom:4px;">Lỗi vi phạm</div>`;
    html += violationList.length ? `<ul style="padding-left:16px; font-size:0.82rem; line-height:1.5; color:#991b1b;">${violationList.join('')}</ul>` : `<div style="color:#15803d; font-style:italic; font-size:0.8rem;">Không có vi phạm!</div>`;
    html += `</div></div>`;
    return html;
}

window.viewStudentDetails = function() {
    const stt = document.getElementById("public-student-select").value;
    const searchType = document.getElementById("search-type-select").value;
    const reportDiv = document.getElementById("student-detail-report");
    if (!stt) { alert("Vui lòng chọn học sinh!"); return; }
    const periodVal = searchType === 'week'
        ? document.getElementById("public-detail-week-select").value
        : document.getElementById("public-detail-month-select").value;
    reportDiv.innerHTML = buildSearchReport(stt, searchType, periodVal);
    reportDiv.style.display = "block";
};

window.viewStudentDetailsMobile = function() {
    const stt = document.getElementById("mobile-student-select").value;
    const searchType = document.getElementById("mobile-search-type").value;
    const reportDiv = document.getElementById("mobile-student-detail-report");
    if (!stt) { alert("Vui lòng chọn học sinh!"); return; }
    const periodVal = searchType === 'week'
        ? document.getElementById("mobile-detail-week-select").value
        : document.getElementById("mobile-detail-month-select").value;
    reportDiv.innerHTML = buildSearchReport(stt, searchType, periodVal);
    reportDiv.style.display = "block";
};

/* ============ QUY CHẾ ============ */
window.renderRulesModal = function() {
    const el = document.getElementById('rules-content');
    if (!el) return;
    el.innerHTML = `
        <div style="background:#fefce8; border:1px solid #fde047; padding:10px; border-radius:8px; margin-bottom:12px;">
            <strong>Quy định:</strong> Mỗi HS có 100 điểm/tuần, cộng/trừ theo nội quy.
        </div>
        <h5 style="color:#1e40af; font-size:0.9rem; margin-bottom:6px;">XẾP LOẠI THÁNG</h5>
        <ul style="padding-left:18px; margin-bottom:12px;">
            <li><strong>TỐT:</strong> TB ≥ 90đ (không tuần nào dưới 80đ)</li>
            <li><strong>KHÁ:</strong> TB 80 – dưới 90đ (không tuần nào dưới 65đ)</li>
            <li><strong>ĐẠT:</strong> TB 50 – dưới 80đ</li>
            <li><strong>CHƯA ĐẠT:</strong> TB &lt; 50đ</li>
        </ul>
        <h5 style="color:#1e40af; font-size:0.9rem; margin-bottom:6px;">XẾP LOẠI HỌC KỲ</h5>
        <ul style="padding-left:18px; margin-bottom:12px;">
            <li><strong>TỐT:</strong> ≥3 tháng TỐT, tháng còn lại không dưới KHÁ</li>
            <li><strong>KHÁ:</strong> ≥3 tháng KHÁ+, tháng còn lại không dưới ĐẠT</li>
            <li><strong>ĐẠT:</strong> ≥3 tháng ĐẠT+, không có tháng CHƯA ĐẠT</li>
            <li><strong>CHƯA ĐẠT:</strong> Còn lại</li>
        </ul>
        <h5 style="color:#1e40af; font-size:0.9rem; margin-bottom:6px;">XẾP LOẠI CẢ NĂM</h5>
        <ul style="padding-left:18px;">
            <li><strong>TỐT:</strong> 2 HK TỐT, hoặc HK1 Khá + HK2 TỐT</li>
            <li><strong>KHÁ:</strong> 2 HK từ KHÁ lên, hoặc HK1 TỐT + HK2 KHÁ, hoặc HK1 ĐẠT + HK2 KHÁ</li>
            <li><strong>ĐẠT:</strong> 2 HK ĐẠT, hoặc HK2 ĐẠT</li>
            <li><strong>CHƯA ĐẠT:</strong> HK2 CHƯA ĐẠT</li>
        </ul>
        <p style="margin-top:10px; font-style:italic; color:#b45309;">* GVCN là người quyết định cuối cùng.</p>
    `;
};

/* ============ ACCORDION & MOBILE PANEL ============ */
window.toggleAcc = function(header) {
    const item = header.parentElement;
    item.classList.toggle('open');
};

window.mobileShowPanel = function(panelId) {
    const source = document.getElementById(panelId);
    if (!source) return;
    document.querySelectorAll('#panel-tab3 > .mobile-acc').forEach(el => el.style.display = 'none');
    document.getElementById('mobile-admin-panel-view').style.display = 'block';

    const content = document.getElementById('mobile-admin-panel-content');
    content.innerHTML = '';
    const clone = source.cloneNode(true);
    clone.classList.add('active');
    clone.style.display = 'block';
    content.appendChild(clone);

    // Re-render các hàm cần thiết
    if (panelId === 'q-hocsinh') renderAdminStudentManager();
    if (panelId === 'q-sodo') renderAdminSeatingMap();
    if (panelId === 'q-chucvu') renderRespRoles();
    if (panelId === 'q-noiquy') renderRuleManager();
    if (panelId === 'q-matkhau') renderPasswordManager();
    if (panelId === 'q-lichkhoa') renderWeekDeadlinesManager();
    if (panelId === 'q-tkb') renderTkbManagerUI();
    if (panelId === 'q-minhchung') renderContestManagerUI();
};

window.mobileClosePanel = function() {
    document.getElementById('mobile-admin-panel-view').style.display = 'none';
    document.querySelectorAll('#panel-tab3 > .mobile-acc').forEach(el => el.style.display = '');
};

/* ============ NỘP ẢNH MINH CHỨNG ============ */
window.renderPublicPhotoSection = function() {
    const section = document.getElementById('photo-contest-section');
    const mobileSection = document.getElementById('mobile-photo-contest-section');
    if (!section && !mobileSection) return;

    const now = new Date();
    const active = Object.entries(STATE.photoContests || {}).filter(([_, c]) => c.active && new Date(c.deadline) > now);

    if (!active.length) {
        if (section) section.style.display = 'none';
        if (mobileSection) mobileSection.innerHTML = '';
        return;
    }
    if (section) section.style.display = 'block';

    let banner = '';
    active.forEach(([id, c]) => {
        const dl = new Date(c.deadline);
        const dlStr = `${String(dl.getHours()).padStart(2,'0')}h${String(dl.getMinutes()).padStart(2,'0')} ngày ${dl.getDate()}/${dl.getMonth()+1}/${dl.getFullYear()}`;
        banner += `<div class="photo-contest-card" style="margin-bottom:8px;">
            <div class="photo-contest-title">${c.name}</div>
            <div class="photo-contest-meta">Hạn: <b>${dlStr}</b> — Tối đa <b>${c.maxPhotos} ảnh</b></div>
            <div style="font-size:0.85rem; color:#7c2d12;">Nộp minh chứng <span class="photo-contest-link" onclick="togglePhotoForm('${id}')">tại đây</span></div>
        </div>`;
    });

    if (mobileSection) mobileSection.innerHTML = banner;

    if (!section) return;

    let form = `<div id="photo-upload-section" style="display:none; background:#fff; border:1.5px solid #8b5cf6; padding:12px; border-radius:10px; margin-top:8px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #e9d5ff; padding-bottom:6px;">
            <h4 style="color:#6b21a8; font-size:0.95rem; margin:0;">NỘP ẢNH MINH CHỨNG</h4>
            <button type="button" onclick="togglePhotoForm()" style="background:#fee2e2; color:#991b1b; border:none; padding:6px 10px; border-radius:6px; font-weight:700; cursor:pointer; font-size:0.75rem;">Đóng</button>
        </div>
        <div class="form-group"><label>Học sinh nộp bài</label><select id="photo-student-select"></select></div>
        <div class="form-group"><label>Cuộc thi đang nộp</label><div id="photo-contest-display" style="padding:10px; background:#faf5ff; border:1.5px solid #8b5cf6; border-radius:8px; font-weight:700; color:#6b21a8;"></div></div>
        <div class="photo-upload-box">
            <div id="photo-contest-info" style="font-size:0.8rem; color:#6b21a8; margin-bottom:8px;"></div>
            <input type="file" id="photo-file-input" accept="image/*" multiple onchange="handlePhotoSelect(event)" style="display:none;">
            <button type="button" class="btn-action btn-purple" style="width:100%; padding:10px;" onclick="document.getElementById('photo-file-input').click()">Chọn ảnh</button>
            <div class="photo-preview-grid" id="photo-preview-grid"></div>
            <div class="photo-progress" id="photo-progress"><div class="photo-progress-bar" id="photo-progress-bar"></div></div>
            <button type="button" id="photo-submit-btn" class="btn-action btn-green" style="width:100%; padding:12px; margin-top:10px; display:none;" onclick="submitPhotoContest()">GỬI</button>
            <div id="photo-upload-status" style="margin-top:10px; font-size:0.82rem;"></div>
        </div></div>`;

    section.innerHTML = banner + form;

    const sel = document.getElementById('photo-student-select');
    if (sel) {
        sel.innerHTML = '<option value="">-- Chọn học sinh --</option>';
        STATE.students.forEach((n, i) => { sel.innerHTML += `<option value="${i+1}">STT ${i+1} - ${n}</option>`; });
    }
};

window._currentContestId = null;
window._photoFiles = [];

window.togglePhotoForm = function(contestId) {
    const form = document.getElementById('photo-upload-section');
    if (!form) return;
    if (form.style.display === 'none') {
        if (contestId) window._currentContestId = contestId;
        form.style.display = 'block';
        onPhotoContestChange();
        setTimeout(() => form.scrollIntoView({ behavior: 'smooth' }), 100);
    } else form.style.display = 'none';
};

window.onPhotoContestChange = function() {
    const cid = window._currentContestId;
    const info = document.getElementById('photo-contest-info');
    const file = document.getElementById('photo-file-input');
    const grid = document.getElementById('photo-preview-grid');
    const btn = document.getElementById('photo-submit-btn');
    const status = document.getElementById('photo-upload-status');
    if (!info) return;
    grid.innerHTML = '';
    file.value = '';
    status.innerHTML = '';
    btn.style.display = 'none';
    window._photoFiles = [];
    if (!cid || !STATE.photoContests[cid]) {
        info.innerHTML = 'Vui lòng chọn cuộc thi.';
        file.disabled = true;
        return;
    }
    const c = STATE.photoContests[cid];
    document.getElementById('photo-contest-display').innerHTML = c.name;
    info.innerHTML = `Tối đa <b>${c.maxPhotos} ảnh</b>. Ảnh tự động nén trước khi gửi.`;
    file.disabled = false;
};

window.handlePhotoSelect = function(ev) {
    const cid = window._currentContestId;
    if (!cid) return;
    const max = STATE.photoContests[cid].maxPhotos;
    let files = Array.from(ev.target.files || []);
    if (files.length > max) { alert(`Tối đa ${max} ảnh!`); files = files.slice(0, max); }
    window._photoFiles = files;
    renderPhotoPreview();
    document.getElementById('photo-submit-btn').style.display = files.length ? 'inline-flex' : 'none';
};

function renderPhotoPreview() {
    const grid = document.getElementById('photo-preview-grid');
    grid.innerHTML = '';
    window._photoFiles.forEach((f, i) => {
        const reader = new FileReader();
        reader.onload = e => {
            grid.innerHTML += `<div class="photo-preview-item"><img src="${e.target.result}"><button class="remove-btn" onclick="removePhoto(${i})">×</button></div>`;
        };
        reader.readAsDataURL(f);
    });
}

window.removePhoto = function(idx) {
    window._photoFiles.splice(idx, 1);
    const dt = new DataTransfer();
    window._photoFiles.forEach(f => dt.items.add(f));
    document.getElementById('photo-file-input').files = dt.files;
    document.getElementById('photo-submit-btn').style.display = window._photoFiles.length ? 'inline-flex' : 'none';
    renderPhotoPreview();
};

function compressImage(file, maxDim, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                let w = img.width, h = img.height;
                if (w > maxDim || h > maxDim) {
                    if (w > h) { h = Math.round(h * maxDim / w); w = maxDim; }
                    else { w = Math.round(w * maxDim / h); h = maxDim; }
                }
                const c = document.createElement('canvas');
                c.width = w; c.height = h;
                c.getContext('2d').drawImage(img, 0, 0, w, h);
                const dataUrl = c.toDataURL('image/jpeg', quality);
                resolve({ base64: dataUrl.split(',')[1], mimeType: 'image/jpeg', fileName: file.name.replace(/\.[^.]+$/, '.jpg') });
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

window.submitPhotoContest = async function() {
    const cid = window._currentContestId;
    const stt = document.getElementById('photo-student-select').value;
    if (!cid || !stt) return alert("Chọn HS và cuộc thi!");
    if (!window._photoFiles?.length) return alert("Chưa chọn ảnh!");
    const cfg = STATE.driveConfig || {};
    if (!cfg.appsScriptUrl || !cfg.folderId) return alert("Chưa cấu hình Drive!");

    const contest = STATE.photoContests[cid];
    const sName = STATE.students[stt - 1];
    const btn = document.getElementById('photo-submit-btn');
    const status = document.getElementById('photo-upload-status');
    const progress = document.getElementById('photo-progress');
    const bar = document.getElementById('photo-progress-bar');
    btn.disabled = true;
    btn.innerHTML = 'Đang nén...';
    progress.style.display = 'block'; bar.style.width = '5%';
    status.innerHTML = '';

    try {
        const compressed = [];
        for (let i = 0; i < window._photoFiles.length; i++) {
            const r = await compressImage(window._photoFiles[i], 1400, 0.82);
            compressed.push(r);
            bar.style.width = (10 + (i+1) / window._photoFiles.length * 60) + '%';
        }
        btn.innerHTML = 'Đang gửi...';
        bar.style.width = '75%';
        const payload = {
            key: cfg.secretKey || '',
            folderId: cfg.folderId,
            contestName: contest.name,
            studentName: sName,
            studentId: stt,
            files: compressed
        };
        const res = await fetch(cfg.appsScriptUrl, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }
        });
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || 'Lỗi');
        bar.style.width = '100%';
        if (!STATE.photoSubmissions[cid]) STATE.photoSubmissions[cid] = {};
        STATE.photoSubmissions[cid][stt] = {
            studentName: sName,
            count: compressed.length,
            submittedAt: new Date().toISOString(),
            files: data.files || [],
            folderUrl: data.folderUrl || ''
        };
        saveData('photoSubmissions', STATE.photoSubmissions);
        status.innerHTML = `<div style="background:#dcfce7; color:#166534; padding:10px; border-radius:8px; font-weight:700;">Nộp thành công ${compressed.length} ảnh!</div>`;
        btn.innerHTML = 'ĐÃ NỘP';
        document.getElementById('photo-preview-grid').innerHTML = '';
        document.getElementById('photo-file-input').value = '';
        window._photoFiles = [];
        setTimeout(() => { progress.style.display = 'none'; bar.style.width = '0%'; }, 2000);
    } catch(err) {
        status.innerHTML = `<div style="background:#fee2e2; color:#991b1b; padding:10px; border-radius:8px; font-weight:700;">Lỗi: ${err.message}</div>`;
        btn.disabled = false;
        btn.innerHTML = 'GỬI';
        progress.style.display = 'none';
    }
};

console.log('%c[OK] TAB 1 LOADED (Phần 3A/4)', 'color:#16a34a; font-weight:bold; font-size:14px;');
/* ============================================================
   PHẦN 3B: TAB 2 — NHẬP LIỆU + QUẢN LÝ HS + ZALO
============================================================ */

/* ============ NHẬP LIỆU - CHẤM ĐIỂM ============ */
window.renderInputPanel = function(groupId, isLocked) {
    const week = document.getElementById("input-week-select").value;
    const container = document.getElementById("group-member-entry-container");
    if (!container) return;
    container.innerHTML = "";
    container.style.display = "block";

    let sttList = [], title;
    const weekData = STATE.emulation[week] || {};
    const isSubmitted = groupId ? weekData['to' + groupId + '_submitted'] : weekData['loptruong_submitted'];

    if (groupId) {
        sttList = getGroupMembers(groupId);
        title = `Chấm thành viên Tổ ${groupId} (${week}):`;
    } else {
        sttList = Object.keys(STATE.positions).filter(s => STATE.positions[s] === "Tổ trưởng").map(Number);
        title = `Lớp trưởng chấm ${sttList.length} Tổ trưởng (${week}):`;
    }

    container.innerHTML = `<h4 style="font-weight:800; color:#1e3a8a; margin-bottom:12px; font-size:1.05rem;">${title}</h4>`;
    if (!STATE.emulation[week]) STATE.emulation[week] = {};

    const grouped = {};
    ERROR_TYPES.forEach(r => {
        const g = r.group ?? 0;
        if (!grouped[g]) grouped[g] = [];
        grouped[g].push(r);
    });

    sttList.forEach(stt => {
        const name = STATE.students[stt - 1];
        if (!name) return;
        const data = STATE.emulation[week][stt] || {};
        const studentPos = STATE.positions[stt] || "";
        const isLeaderTarget = (groupId && studentPos === "Tổ trưởng");
        let boxes = '';

        Object.keys(grouped).map(Number).sort((a,b) => a-b).forEach(gNum => {
            const gr = RULE_GROUPS[gNum] || { name: 'Nhóm ' + gNum, color: '#64748b' };
            const items = grouped[gNum];

            const itemsHTML = items.map(err => {
                const isCustom = (err.pen === 'custom_sub' || err.pen === 'custom_add');
                const isBonus = (typeof err.pen === 'number' && err.pen < 0) || err.pen === 'custom_add';
                const isWeekly = err.weekly === true;
                const dis = (isLocked || isLeaderTarget) ? 'disabled' : '';

                if (isWeekly) {
                    const cnt = data[err.key] || 0;
                    const pts = Math.abs(err.pen) || 10;
                    return `<div class="error-counter-box weekly">
                        <span class="error-label" style="font-weight:800; color:#92400e;">${err.label}
                            <span style="background:#fde047; color:#78350f; padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:800; margin-left:6px;">+${pts}đ</span>
                        </span>
                        <div class="counter-controls">
                            <input type="checkbox" ${cnt>0?'checked':''} ${dis} onchange="toggleWeeklyError(${stt},'${err.key}',this.checked)" style="width:28px;height:28px;cursor:pointer;accent-color:#d97706;">
                        </div></div>`;
                }

                const inputHtml = isCustom
                    ? `<input type="number" class="count-val" value="${data[err.key]||0}" onchange="setExactError(${stt}, '${err.key}', this.value)" min="0" ${dis}>`
                    : `<input type="number" class="count-val" value="${data[err.key]||0}" readonly ${dis}>`;
                const minusBtn = (isCustom || isLocked || isLeaderTarget) ? '' : `<button class="btn-count" onclick="updateError(${stt}, '${err.key}', -1)">−</button>`;
                const plusBtn = (isCustom || isLocked || isLeaderTarget) ? '' : `<button class="btn-count" onclick="updateError(${stt}, '${err.key}', 1)">+</button>`;

                let ptLabel = '';
                if (typeof err.pen === 'number') {
                    ptLabel = err.pen < 0
                        ? `<span style="background:#dcfce7;color:#166534;padding:1px 6px;border-radius:4px;font-size:0.65rem;font-weight:800;margin-left:4px;">+${Math.abs(err.pen)}đ</span>`
                        : `<span style="background:#fee2e2;color:#991b1b;padding:1px 6px;border-radius:4px;font-size:0.65rem;font-weight:800;margin-left:4px;">-${err.pen}đ</span>`;
                }

                return `<div class="error-counter-box ${isBonus ? 'bonus' : ''}">
                    <span class="error-label">${err.label}${ptLabel}</span>
                    <div class="counter-controls">${minusBtn}${inputHtml}${plusBtn}</div></div>`;
            }).join('');

            if (!itemsHTML) return;
            boxes += `<div class="err-group-mini" style="border-color:${gr.color};">
                <div class="err-group-mini-header" onclick="this.parentElement.classList.toggle('closed')" style="background:${gr.color}; color:#fff;">
                    <span>${gr.name}</span>
                    <i class="fa-solid fa-chevron-down" style="transition:transform 0.25s;"></i>
                </div>
                <div class="err-group-mini-body">${itemsHTML}</div></div>`;
        });

        const total = calculateScore(stt, data);
        container.innerHTML += `<div class="student-entry-card" style="border-left:4px solid ${groupId ? '#0ea5e9' : '#b91c1c'};">
            <div class="student-entry-header">
                <div style="font-size:0.95rem; font-weight:800; color:#0f172a;">${name}</div>
                <div style="font-size:1.1rem; font-weight:900; background:#f1f5f9; padding:2px 8px; border-radius:6px; color:${total>=80?'#16a34a':'#dc2626'};">${total}đ</div>
            </div>${boxes}</div>`;
    });

    if (!isLocked) {
        const lbl = isSubmitted ? "CẬP NHẬT LẠI BÁO CÁO" : "CHỐT & GỬI BÁO CÁO TUẦN";
        const clr = isSubmitted ? "#0284c7" : "#16a34a";
        container.innerHTML += `<div style="margin-top:16px;">
            <button class="btn-action" style="width:100%; background:${clr}; font-size:1.05rem; padding:12px;" onclick="finalizeReport('${groupId}')">
                ${lbl}</button></div>`;
    }
};

window.updateError = function(stt, errKey, delta) {
    const week = document.getElementById("input-week-select").value;
    if (!STATE.emulation[week]) STATE.emulation[week] = {};
    if (!STATE.emulation[week][stt]) STATE.emulation[week][stt] = {};
    let v = (STATE.emulation[week][stt][errKey] || 0) + delta;
    if (v < 0) v = 0;
    STATE.emulation[week][stt][errKey] = v;
    verifyAuthAndRender();
    setTimeout(() => renderPublicSummaryTable(), 300);
};

window.setExactError = function(stt, errKey, valStr) {
    const week = document.getElementById("input-week-select").value;
    let v = parseInt(valStr);
    if (isNaN(v) || v < 0) v = 0;
    if (!STATE.emulation[week]) STATE.emulation[week] = {};
    if (!STATE.emulation[week][stt]) STATE.emulation[week][stt] = {};
    STATE.emulation[week][stt][errKey] = v;
    verifyAuthAndRender();
};

window.toggleWeeklyError = function(stt, errKey, checked) {
    const week = document.getElementById("input-week-select").value;
    if (!STATE.emulation[week]) STATE.emulation[week] = {};
    if (!STATE.emulation[week][stt]) STATE.emulation[week][stt] = {};
    STATE.emulation[week][stt][errKey] = checked ? 1 : 0;
    saveData('emulation', STATE.emulation);
    verifyAuthAndRender();
    setTimeout(() => renderPublicSummaryTable(), 300);
};

/* ============ TRỰC NHẬT - FORM ============ */
window.renderDutyForm = function() {
    const container = document.getElementById("duty-entry-container");
    if (!container) return;
    container.style.display = "block";

    const week = document.getElementById("input-week-select")?.value || "Tuần 1";
    const safeWeek = week.replace(/\s+/g, '');
    const days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

    let html = `<div style="background:#f0fdfa; border:1px solid #99f6e4; border-radius:10px; padding:12px; margin-bottom:12px;">
        <div style="font-weight:700; color:#0f766e; font-size:0.9rem; margin-bottom:8px;">Phân công: <span style="color:#0d9488;">${week}</span></div>
        <div style="font-size:0.75rem; color:#475569; margin-bottom:12px;">Chạm vào ô để chọn học sinh.</div>`;

    days.forEach((day, i) => {
        const dayKey = i + 1;
        html += `<div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:10px; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-weight:700; color:#1e293b; font-size:0.85rem;">${day}</span>
                <button type="button" onclick="addDutySlotCard('${week}', ${dayKey})" style="background:#0d9488; color:#fff; border:none; padding:4px 10px; border-radius:6px; font-size:0.75rem; font-weight:600; cursor:pointer;">+ Thêm bạn</button>
            </div>
            <div id="duty-slots-${safeWeek}-${dayKey}" style="display:flex; flex-direction:column; gap:6px; margin-bottom:8px;"></div>
            <div style="display:flex; align-items:center; gap:8px; background:#fffbeb; border:1px solid #fde68a; border-radius:6px; padding:6px 8px;">
                <span style="font-size:0.75rem; font-weight:700; color:#b45309; min-width:65px;">Trưởng:</span>
                <select id="duty-leader-${safeWeek}-${dayKey}" style="flex:1; padding:6px; border:1px solid #f59e0b; border-radius:4px; font-size:0.8rem; background:#fff; font-weight:600;">
                    <option value="">-- Chọn nhóm trưởng --</option>
                    ${(STATE.students || []).map((n, i) => `<option value="${i+1}. ${n}">${i+1}. ${n}</option>`).join('')}
                </select>
            </div>
        </div>`;
    });

    html += `<button type="button" onclick="savedDutyData()" class="btn-action" style="width:100%; background:#0d9488; padding:12px; font-size:0.95rem;">Lưu lịch trực tuần này</button></div>`;

    container.innerHTML = html;

    setTimeout(() => {
        days.forEach((_, i) => {
            const dayKey = i + 1;
            const dayData = STATE.duty?.[week]?.[dayKey] || {};
            let members = [], leader = "";
            if (typeof dayData === 'object' && dayData !== null) {
                leader = dayData.leader || "";
                members = Array.isArray(dayData.members) ? dayData.members : [];
            }
            if (!members.length) members = [""];
            members.forEach(v => addDutySlotCard(week, dayKey, v));
            const leadElem = document.getElementById(`duty-leader-${safeWeek}-${dayKey}`);
            if (leadElem && leader) leadElem.value = leader;
        });
    }, 50);
};

window.addDutySlotCard = function(week, dayKey, selectedValue = "") {
    const safeWeek = week.replace(/\s+/g, '');
    const slot = document.getElementById(`duty-slots-${safeWeek}-${dayKey}`);
    if (!slot) return;
    const div = document.createElement('div');
    div.style.cssText = "display:flex; align-items:center; gap:6px;";
    let sHTML = `<select class="duty-member-sel duty-member-sel-${safeWeek}-${dayKey}" style="flex:1; padding:7px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.82rem; background:#f8fafc;">
        <option value="">-- Chọn bạn trực nhật --</option>`;
    (STATE.students || []).forEach((n, i) => {
        const v = `${i+1}. ${n}`;
        sHTML += `<option value="${v}" ${v === selectedValue ? 'selected' : ''}>${v}</option>`;
    });
    sHTML += `</select>`;
    div.innerHTML = sHTML + `<button type="button" onclick="this.parentElement.remove()" style="background:#fee2e2; color:#ef4444; border:1px solid #fca5a5; width:34px; height:34px; border-radius:6px; font-weight:bold; cursor:pointer;">×</button>`;
    slot.appendChild(div);
};

window.savedDutyData = function(isAutoSave = false) {
    try {
        const week = document.getElementById("input-week-select").value;
        const safeWeek = week.replace(/\s+/g, '');
        const days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];
        if (!STATE.duty) STATE.duty = {};
        if (!STATE.duty[week]) STATE.duty[week] = {};
        days.forEach((_, i) => {
            const dayKey = i + 1;
            const leader = document.getElementById(`duty-leader-${safeWeek}-${dayKey}`)?.value || "";
            const members = [];
            document.querySelectorAll(`.duty-member-sel-${safeWeek}-${dayKey}`).forEach(sel => {
                if (sel.value) members.push(sel.value);
            });
            STATE.duty[week][dayKey] = { leader, members };
        });
        saveData('duty', STATE.duty);
        renderPublicDuty();
        renderPublicDutyMobile();
        if (!isAutoSave) alert(`Đã lưu lịch trực ${week}!`);
    } catch(e) {
        console.error("Lỗi duty:", e);
        if (!isAutoSave) alert("Lỗi: " + e.message);
    }
};

/* ============ QUẢN LÝ HỌC SINH ============ */
window.renderAdminStudentManager = function() {
    const tbody = document.getElementById("admin-student-table-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    const positionOptions = ['', ...STATE.respRoles.map(r => r.name)];
    const groupOptions = ["", "Tổ 1", "Tổ 2", "Tổ 3", "Tổ 4"];

    STATE.students.forEach((name, i) => {
        const stt = i + 1;
        const phone = STATE.phones[stt] || "";
        const curPos = STATE.positions[stt] || "";
        const curGroup = STATE.studentGroups?.[stt] || "";

        const zaloBtn = phone
            ? `<a href="https://zalo.me/${phone}" target="_blank" style="background:#eff6ff; color:#0068ff; padding:5px 10px; border-radius:6px; font-weight:700; font-size:0.75rem; text-decoration:none; display:inline-flex; align-items:center; gap:4px; border:1px solid #bfdbfe;">Zalo</a>`
            : `<span style="color:#94a3b8; font-size:0.75rem; font-style:italic;">Chưa có</span>`;

        let posSel = `<select onchange="updateStudentPosition(${stt}, this.value)" style="padding:5px 8px; font-size:0.78rem; border:1px solid #cbd5e1; border-radius:6px; background:#fff; font-weight:600; color:#334155; outline:none; cursor:pointer; width:100%;">`;
        positionOptions.forEach(p => {
            posSel += `<option value="${p}" ${curPos === p ? 'selected' : ''}>${p === "" ? "-- Chức vụ --" : p}</option>`;
        });
        posSel += `</select>`;

        let grpSel = `<select onchange="updateStudentGroup(${stt}, this.value)" style="padding:5px 8px; font-size:0.78rem; border:1px solid #d97706; border-radius:6px; background:#fffbeb; font-weight:bold; color:#b45309; outline:none; cursor:pointer; width:100%;">`;
        groupOptions.forEach(g => {
            grpSel += `<option value="${g}" ${curGroup === g ? 'selected' : ''}>${g === "" ? "-- Chọn Tổ --" : g}</option>`;
        });
        grpSel += `</select>`;

        tbody.innerHTML += `<tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:10px 8px; text-align:center; color:#64748b; font-weight:600;">${stt}</td>
            <td style="padding:10px 8px; font-weight:700; color:#0f172a; text-align:left;">${name}</td>
            <td style="padding:10px 8px;"><input type="text" value="${phone}" onchange="updateStudentPhone(${stt}, this.value)" placeholder="Nhập SĐT..." style="padding:6px 10px; font-size:0.8rem; border:1px solid #cbd5e1; border-radius:6px; width:100%; outline:none;"></td>
            <td style="padding:10px 8px; text-align:center;">${posSel}</td>
            <td style="padding:10px 8px; text-align:center;">${grpSel}</td>
            <td style="padding:10px 8px; text-align:center;">${zaloBtn}</td>
            <td style="padding:10px 8px; text-align:center;"><button onclick="deleteStudent(${i})" class="btn-action btn-red" style="padding:6px 12px; font-size:0.75rem;">Xóa</button></td>
        </tr>`;
    });
};

window.updateStudentPhone = function(stt, phoneVal) {
    if (!STATE.phones) STATE.phones = {};
    STATE.phones[stt] = phoneVal.trim();
    saveData('phones', STATE.phones);
};

window.updateStudentPosition = function(stt, posVal) {
    if (!STATE.positions) STATE.positions = {};
    if (posVal === "") delete STATE.positions[stt];
    else STATE.positions[stt] = posVal;
    saveData('positions', STATE.positions);
};

window.updateStudentGroup = function(stt, groupVal) {
    if (!STATE.studentGroups) STATE.studentGroups = {};
    if (groupVal === "") delete STATE.studentGroups[stt];
    else STATE.studentGroups[stt] = groupVal;
    saveData('studentGroups', STATE.studentGroups);
    if (typeof autoMapStudentsByGroup === 'function') autoMapStudentsByGroup();
};

window.addNewStudent = function() {
    const nameInput = document.getElementById("new-student-name");
    const phoneInput = document.getElementById("new-student-phone");
    const name = nameInput?.value.trim() || "";
    const phone = phoneInput?.value.trim() || "";
    if (!name) return alert("Vui lòng nhập tên!");
    STATE.students.push(name);
    const newStt = STATE.students.length;
    if (phone) {
        if (!STATE.phones) STATE.phones = {};
        STATE.phones[newStt] = phone;
        saveData('phones', STATE.phones);
    }
    saveData('students', STATE.students);
    nameInput.value = "";
    phoneInput.value = "";
    renderAdminStudentManager();
    populateSelects();
    alert(`Đã thêm HS ${name}!`);
};

window.deleteStudent = function(index) {
    const name = STATE.students[index];
    if (!confirm(`Xóa học sinh "${name}"?`)) return;
    STATE.students.splice(index, 1);
    const newPhones = {}, newPositions = {}, newGroups = {};
    STATE.students.forEach((_, i) => {
        const oldStt = i >= index ? i + 2 : i + 1;
        if (STATE.phones[oldStt]) newPhones[i+1] = STATE.phones[oldStt];
        if (STATE.positions[oldStt]) newPositions[i+1] = STATE.positions[oldStt];
        if (STATE.studentGroups?.[oldStt]) newGroups[i+1] = STATE.studentGroups[oldStt];
    });
    STATE.phones = newPhones;
    STATE.positions = newPositions;
    STATE.studentGroups = newGroups;
    saveData('students', STATE.students);
    saveData('phones', STATE.phones);
    saveData('positions', STATE.positions);
    saveData('studentGroups', STATE.studentGroups);
    renderAdminStudentManager();
    populateSelects();
    alert("Đã xóa!");
};

window.importBulkStudents = function(isReplace) {
    const raw = document.getElementById("bulk-student-input")?.value.trim() || "";
    if (!raw) return alert("Vui lòng nhập danh sách!");
    const lines = raw.split("\n");
    const newStudents = [];
    const newPhones = isReplace ? {} : { ...STATE.phones };
    const startIdx = isReplace ? 1 : STATE.students.length + 1;

    lines.forEach(line => {
        const parts = line.trim().split(/\s{2,}|\t/);
        let name = parts[0]?.trim() || "";
        let phone = parts[1]?.trim() || "";
        if (!name && line.trim()) {
            const words = line.trim().split(/\s+/);
            const last = words[words.length - 1];
            if (/^\d{9,11}$/.test(last)) {
                phone = last;
                name = words.slice(0, -1).join(" ");
            } else name = line.trim();
        }
        if (name) {
            newStudents.push(name);
            if (phone) newPhones[startIdx + newStudents.length - 1] = phone;
        }
    });

    if (!newStudents.length) return alert("Không đọc được dữ liệu!");
    if (isReplace) {
        if (!confirm(`XÓA TẤT CẢ và thay bằng ${newStudents.length} HS mới?`)) return;
        STATE.students = newStudents;
        STATE.phones = newPhones;
        STATE.positions = {};
    } else {
        STATE.students = STATE.students.concat(newStudents);
        STATE.phones = newPhones;
    }
    saveData('students', STATE.students);
    saveData('phones', STATE.phones);
    saveData('positions', STATE.positions);
    renderAdminStudentManager();
    populateSelects();
    document.getElementById("bulk-student-input").value = "";
    alert(`Đã nhập ${newStudents.length} HS!`);
};

/* ============ ZALO SUMMARY ============ */
window.renderAdminZaloSummary = function() {
    const sel = document.getElementById("admin-zalo-week-select");
    const tbody = document.getElementById("admin-zalo-summary-tbody");
    if (!sel || !tbody) return;
    const week = sel.value;
    tbody.innerHTML = "";

    if (!STATE.students?.length) {
        tbody.innerHTML = `<tr><td colspan="5" style="padding:15px; color:#b91c1c; font-style:italic;">Chưa có dữ liệu HS!</td></tr>`;
        return;
    }

    STATE.students.forEach((name, idx) => {
        const stt = idx + 1;
        const phone = STATE.phones[stt] || "";
        const isSub = isStudentWeekSubmitted(stt, week);
        const sd = STATE.emulation?.[week]?.[stt] || {};
        const total = isSub ? calculateScore(stt, sd, week) : '--';

        const bonus = [], errs = [];
        if (isSub) {
            ERROR_TYPES.forEach(err => {
                const c = sd[err.key] || 0;
                if (c > 0) {
                    if (err.weekly || err.pen === 'custom_add' || (typeof err.pen === 'number' && err.pen < 0)) {
                        bonus.push(`${err.label} (${c})`);
                    } else if (err.pen !== 'custom_add') {
                        errs.push(`${err.label} (${c})`);
                    }
                }
            });
        }
        let detail = "";
        if (bonus.length) detail += `\n+ Ưu: ${bonus.join(', ')}`;
        if (errs.length) detail += `\n- Vi phạm: ${errs.join(', ')}`;
        if (!detail) detail = `\n+ Thực hiện tốt nội quy.`;

        const msg = isSub
            ? `GVCN ${STATE.config.className} thông báo điểm ${week} của ${name}:\n* Tổng: ${total}đ${detail}\n\nTrân trọng!`
            : `GVCN ${STATE.config.className} thông báo: chưa có dữ liệu điểm ${week} của ${name}.`;

        const action = phone
            ? `<a href="https://zalo.me/${phone}?text=${encodeURIComponent(msg)}" target="_blank" class="btn-action" style="background:#0068ff; padding:6px 12px; font-size:0.78rem; text-decoration:none;">Gửi</a>`
            : `<span style="color:#94a3b8; font-size:0.75rem; font-style:italic;">Chưa có SĐT</span>`;

        tbody.innerHTML += `<tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:8px;"><strong>${stt}</strong></td>
            <td style="text-align:left; padding:8px; font-weight:600;">${name}</td>
            <td style="padding:8px;"><strong style="color:${total === '--' ? '#94a3b8' : (total < 80 ? '#dc2626' : '#16a34a')};">${total}</strong></td>
            <td style="text-align:left; padding:8px;">
                <textarea id="zalo-msg-${stt}" rows="4" style="width:100%; padding:8px; font-size:0.8rem; border-radius:6px; border:1px solid #cbd5e1; outline:none; resize:vertical; font-family:inherit;">${msg}</textarea>
            </td>
            <td style="padding:8px;">${action}</td>
        </tr>`;
    });
};

console.log('%c[OK] TAB 2 + HS + ZALO LOADED (Phần 3B/4)', 'color:#16a34a; font-weight:bold; font-size:14px;');
/* ============================================================
   PHẦN 3C: XẾP LOẠI ĐỊNH KỲ + PDF + LỊCH KHÓA + NỘI QUY
============================================================ */

/* ============ XẾP LOẠI ĐỊNH KỲ ============ */
window.loadAdminGradingTable = function() {
    const period = document.getElementById("admin-grading-period").value;
    const editor = document.getElementById("admin-grading-editor-container");
    const thead = document.getElementById("admin-grading-editor-thead");
    const tbody = document.getElementById("admin-grading-editor-tbody");
    tbody.innerHTML = "";
    editor.style.display = "block";

    const saved = STATE.officialGrades[period] || {};
    const isMonth = period.startsWith("Tháng");
    const isSem = period.startsWith("Học Kỳ");
    const subPeriods = isMonth
        ? MONTH_WEEKS[period].map(w => "Tuần " + w)
        : (isSem
            ? (period === "Học Kỳ 1" ? ["Tháng 9","Tháng 10","Tháng 11","Tháng 12"] : ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5"])
            : ["Học Kỳ 1", "Học Kỳ 2"]);

    let th = `<tr style="background:#fefce8; color:#b45309;"><th style="width:45px;">STT</th><th style="text-align:left;">Học sinh</th>`;
    subPeriods.forEach(sp => th += `<th>${sp.replace("Tháng ", "T").replace("Học Kỳ ", "HK")}</th>`);
    th += `<th style="width:110px;">Gợi ý</th><th style="width:140px;">Chốt</th></tr>`;
    thead.innerHTML = th;

    STATE.students.forEach((name, idx) => {
        const stt = idx + 1;
        const sug = isMonth ? evaluateMonth(stt, period).grade : (isSem ? evaluateSemester(stt, period) : evaluateYear(stt));
        let td = "";
        subPeriods.forEach(sp => {
            const g = isMonth
                ? (isStudentWeekSubmitted(stt, sp) ? calculateScore(stt, STATE.emulation[sp]?.[stt] || {}, sp) : '--')
                : getGradeForPeriod(stt, sp);
            td += `<td style="font-size:0.75rem; font-weight:600;">${g}</td>`;
        });
        const cur = saved[stt] && saved[stt] !== '--' ? saved[stt] : sug;
        tbody.innerHTML += `<tr>
            <td><strong>${stt}</strong></td>
            <td style="text-align:left;">${name}</td>
            ${td}
            <td id="suggested-grade-${stt}" style="color:#1e40af; font-weight:bold;">${sug}</td>
            <td><select id="grade-edit-${stt}" style="padding:4px; border-radius:6px; border:1px solid #d97706; font-weight:bold; color:#b45309; width:100%;">
                <option value="--" ${cur==='--'?'selected':''}>--</option>
                <option value="TỐT" ${cur==='TỐT'?'selected':''}>TỐT</option>
                <option value="KHÁ" ${cur==='KHÁ'?'selected':''}>KHÁ</option>
                <option value="ĐẠT" ${cur==='ĐẠT'?'selected':''}>ĐẠT</option>
                <option value="CHƯA ĐẠT" ${cur==='CHƯA ĐẠT'?'selected':''}>CHƯA ĐẠT</option>
            </select></td></tr>`;
    });
};

window.syncSuggestedGrades = function() {
    if (!confirm("Áp dụng gợi ý vào ô Chốt?")) return;
    STATE.students.forEach((_, idx) => {
        const stt = idx + 1;
        const sug = document.getElementById(`suggested-grade-${stt}`);
        const sel = document.getElementById(`grade-edit-${stt}`);
        if (sel && sug) sel.value = sug.innerText.trim();
    });
};

window.finalizeGradingPeriod = function() {
    const period = document.getElementById("admin-grading-period").value;
    if (!confirm(`Chốt kết quả xếp loại ${period}?`)) return;
    if (!STATE.officialGrades[period]) STATE.officialGrades[period] = {};
    STATE.students.forEach((_, idx) => {
        const stt = idx + 1;
        const sel = document.getElementById(`grade-edit-${stt}`);
        if (sel) STATE.officialGrades[period][stt] = sel.value;
    });
    saveData('officialGrades', STATE.officialGrades);
    alert(`Đã chốt ${period}!`);
    renderPublicSummaryTable();
};

window.exportAdminTableToCSV = function() {
    const table = document.getElementById("admin-grading-table-export");
    if (!table || !table.innerText.trim()) return alert("Tải bảng trước!");
    let csv = "\uFEFF";
    table.querySelectorAll("tr").forEach(row => {
        const r = [];
        row.querySelectorAll("th, td").forEach(cell => {
            let text = cell.querySelector("select") ? cell.querySelector("select").value : cell.innerText.replace(/"/g, '""').trim();
            r.push(`"${text}"`);
        });
        csv += r.join(",") + "\n";
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = STATE.config.className + "_XepLoai.csv";
    a.click();
};

/* ============ XUẤT PDF ============ */
function getStudentReportHTML(stt, type, period) {
    const name = STATE.students[stt - 1];
    let targetWeeks = [];
    if (type === 'week') targetWeeks = [period];
    else if (type === 'month') targetWeeks = (MONTH_WEEKS[period] || []).map(w => "Tuần " + w);
    else if (type === 'semester') {
        const ms = period === "Học Kỳ 1" ? ["Tháng 9","Tháng 10","Tháng 11","Tháng 12"] : ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5"];
        ms.forEach(m => (MONTH_WEEKS[m] || []).forEach(w => targetWeeks.push("Tuần " + w)));
    } else if (type === 'year') for (let i = 1; i <= 35; i++) targetWeeks.push("Tuần " + i);

    let reportContent = "", totalErrors = 0, totalWeeks = 0;
    targetWeeks.forEach(weekName => {
        const data = STATE.emulation[weekName]?.[stt] || {};
        const isSub = isStudentWeekSubmitted(stt, weekName);
        if (!isSub) {
            reportContent += `<tr><td style="padding:10px; border:1px solid #000; text-align:center;"><strong>${weekName}</strong></td><td style="padding:10px; border:1px solid #000; text-align:center;">--</td><td style="padding:10px; border:1px solid #000; text-align:center; font-style:italic; color:#64748b;">Chưa có dữ liệu</td></tr>`;
            return;
        }
        totalWeeks++;
        const details = [];
        let errCount = 0;
        ERROR_TYPES.forEach(err => {
            const c = data[err.key] || 0;
            if (c > 0) {
                if (err.weekly) details.push(`• ${err.label} (+${Math.abs(err.pen)}đ)`);
                else if (err.pen === 'custom_add') details.push(`• ${err.label} (+${c}đ)`);
                else if (err.pen === 'custom_sub') { details.push(`• ${err.label} (-${c}đ)`); errCount += c; }
                else if (typeof err.pen === 'number' && err.pen < 0) details.push(`• ${err.label} (+${Math.abs(err.pen) * c}đ)`);
                else { details.push(`• ${err.label} (x${c} → -${calculatePenalty(err.pen, c)}đ)`); errCount += c; }
            }
        });
        const score = calculateScore(stt, data);
        totalErrors += errCount;
        const ds = details.length ? details.join('<br>') : `<em>Thực hiện tốt nội quy.</em>`;
        reportContent += `<tr><td style="padding:10px; border:1px solid #000; text-align:center;"><strong>${weekName}</strong></td><td style="padding:10px; border:1px solid #000; text-align:center;"><strong style="font-size:16px;">${score}</strong></td><td style="padding:10px; border:1px solid #000; line-height:1.6;">${ds}</td></tr>`;
    });

    if (totalWeeks === 0) reportContent = `<tr><td colspan="3" style="padding:15px; border:1px solid #000; text-align:center; font-style:italic;">Chưa có dữ liệu.</td></tr>`;

    let monthly = "";
    if (type === 'semester' || type === 'year') {
        const ms = type === 'semester'
            ? (period === "Học Kỳ 1" ? ["Tháng 9","Tháng 10","Tháng 11","Tháng 12"] : ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5"])
            : ["Tháng 9","Tháng 10","Tháng 11","Tháng 12","Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5"];
        monthly = `<p style="font-weight:bold; font-size:16px; text-transform:uppercase; margin-bottom:8px;">1. TỔNG HỢP HẠNH KIỂM TỪNG THÁNG</p><table><thead><tr><th>Tháng</th><th>Chi tiết điểm các tuần</th><th>Hạnh kiểm</th></tr></thead><tbody>`;
        ms.forEach(m => {
            const mg = getGradeForPeriod(stt, m);
            const ws = MONTH_WEEKS[m] || [];
            const wScores = ws.map(w => {
                const wk = "Tuần " + w;
                return isStudentWeekSubmitted(stt, wk) ? `T${w}: <strong>${calculateScore(stt, STATE.emulation[wk][stt])}</strong>` : `T${w}: --`;
            }).join(' | ');
            monthly += `<tr><td style="padding:8px; border:1px solid #000; text-align:center;"><strong>${m}</strong></td><td style="padding:8px; border:1px solid #000; text-align:center;">${wScores}</td><td style="padding:8px; border:1px solid #000; text-align:center; font-weight:bold; color:#1e40af;">${mg}</td></tr>`;
        });
        monthly += `</tbody></table>`;
    }

    const finalGrade = getGradeForPeriod(stt, period);
    let overview = "";
    if (type === 'week') {
        const sc = isStudentWeekSubmitted(stt, period) ? calculateScore(stt, STATE.emulation[period]?.[stt]) : '--';
        overview = `<div style="display:flex; justify-content:space-around; background:#f8fafc; border:2px solid #000; padding:15px; margin-bottom:20px;"><div style="text-align:center;"><div style="font-size:14px; font-weight:bold;">TỔNG ĐIỂM</div><div style="font-size:28px; font-weight:bold;">${sc}</div></div><div style="width:2px; background:#000;"></div><div style="text-align:center;"><div style="font-size:14px; font-weight:bold;">SỐ LỖI</div><div style="font-size:28px; font-weight:bold;">${totalErrors}</div></div></div>`;
    } else {
        overview = `<div style="display:flex; justify-content:space-around; background:#f8fafc; border:2px solid #000; padding:15px; margin-bottom:20px;"><div style="text-align:center; flex:1;"><div style="font-size:14px; font-weight:bold;">XẾP LOẠI</div><div style="font-size:26px; font-weight:bold; margin-top:5px; text-transform:uppercase;">${finalGrade}</div></div></div>`;
    }

    const classNameClean = STATE.config.className.replace(/lớp/ig, '').trim();
    return `<div class="page-break"><div class="header"><div class="school-info">SỞ GD&ĐT BẮC NINH<br>${(STATE.config.schoolName || "").toUpperCase()}<br>-------</div><div class="national-title">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>Độc lập - Tự do - Hạnh phúc<br>-------</div></div><div class="title">PHIẾU BÁO CÁO KẾT QUẢ RÈN LUYỆN<br><span style="font-size:16px; font-weight:normal;">Thời gian: ${period} - Năm học: ${STATE.config.schoolYear}</span></div><div style="font-size:16px; margin-bottom:20px; line-height:1.8;">Họ tên: <strong>${name}</strong><br>Lớp: <strong>${classNameClean}</strong><br>GVCN: <strong>${STATE.config.teacherName}</strong></div>${overview}${monthly}<p style="font-weight:bold; font-size:16px; text-transform:uppercase; margin-bottom:8px;">2. CHI TIẾT ĐIỂM SỐ & VI PHẠM</p><table><thead><tr><th style="width:20%;">Thời gian</th><th style="width:15%;">Điểm</th><th>Chi tiết</th></tr></thead><tbody>${reportContent}</tbody></table><div class="footer"><div class="signature-box"><strong>Ý kiến PH</strong><br><i>(Ký, ghi rõ họ tên)</i></div><div class="signature-box"><strong>GVCN</strong><br><i>(Ký, ghi rõ họ tên)</i><br><br><br><br><strong>${STATE.config.teacherName}</strong></div></div></div>`;
}

function openPDFPrintWindow(html, title) {
    const w = window.open('', '_blank');
    if (!w) return alert("Cho phép mở popup!");
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title><style>body{font-family:'Times New Roman',serif;padding:30px;color:#000;line-height:1.5;max-width:900px;margin:0 auto;}.header{display:flex;justify-content:space-between;margin-bottom:25px;text-align:center;}.school-info,.national-title{font-weight:bold;font-size:14px;}.title{text-align:center;font-size:22px;font-weight:bold;margin:15px 0;text-transform:uppercase;}table{width:100%;border-collapse:collapse;margin-bottom:20px;}th,td{border:1px solid #000;padding:10px;font-size:15px;}th{background:#f2f2f2;text-align:center;font-weight:bold;}.footer{display:flex;justify-content:space-between;margin-top:40px;text-align:center;font-size:15px;}.signature-box{width:45%;}.no-print-bar{background:#eff6ff;border:1px solid #3b82f6;padding:15px;margin-bottom:20px;border-radius:8px;text-align:center;font-family:sans-serif;}.btn-save{background:#2563eb;color:#fff;border:none;padding:10px 20px;border-radius:6px;font-weight:bold;cursor:pointer;font-size:15px;}.page-break{page-break-after:always;margin-bottom:60px;padding-bottom:20px;}.page-break:last-child{page-break-after:auto;margin-bottom:0;}@media print{.no-print-bar{display:none!important;}body{padding:0;max-width:100%;}.page-break{margin-bottom:0;padding-bottom:0;}}</style></head><body><div class="no-print-bar"><span style="font-size:15px;margin-right:12px;">Chọn máy in là <strong>"Save as PDF"</strong> để tải:</span><button class="btn-save" onclick="window.print()">TẢI PDF</button></div>${html}</body></html>`);
    w.document.close();
    w.focus();
}

window.exportStudentReport = function() {
    const stt = document.getElementById("admin-print-student").value;
    if (!stt) return alert("Chọn học sinh!");
    const type = document.getElementById("admin-print-type").value;
    const period = document.getElementById("admin-print-period").value;
    openPDFPrintWindow(getStudentReportHTML(stt, type, period), STATE.students[stt - 1]);
};

window.exportAllStudentsReport = function() {
    const type = document.getElementById("admin-print-type").value;
    const period = document.getElementById("admin-print-period").value;
    if (!confirm(`Xuất PDF cho TOÀN BỘ ${STATE.students.length} HS?`)) return;
    let all = "";
    STATE.students.forEach((_, i) => all += getStudentReportHTML(i + 1, type, period));
    openPDFPrintWindow(all, `Ca_Lop_${period}`);
};

/* ============ LỊCH KHÓA TUẦN ============ */
function dateToInput(d) {
    if (!d || isNaN(d.getTime())) return "";
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}T${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

window.renderWeekDeadlinesManager = function() {
    const container = document.getElementById('week-deadlines-container');
    if (!container) return;

    let html = `<div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:10px; margin-bottom:12px; font-size:0.8rem; color:#1e40af; line-height:1.6;">
        <b>Cách dùng:</b><br>
        • <b>Hạn nộp:</b> sau mốc này Tổ trưởng vẫn nộp được nhưng ghi nhận nộp muộn.<br>
        • <b>Hạn khóa:</b> sau mốc này hệ thống khóa hoàn toàn.<br>
        • Tuần không đặt riêng → dùng công thức mặc định.</div>`;

    html += `<div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center; background:#fff; padding:10px; border-radius:8px; border:1px solid #bfdbfe; margin-bottom:12px;">
        <label style="font-weight:700; color:#1e40af; font-size:0.85rem;">Chọn tuần:</label>
        <select id="wd-week-select" onchange="loadWeekDeadlineToForm()" style="padding:8px; border-radius:6px; border:1.5px solid #93c5fd; font-weight:700; font-size:0.85rem; min-width:120px; width:auto;">`;
    for (let i = 1; i <= 35; i++) html += `<option value="Tuần ${i}">Tuần ${i}</option>`;
    html += `</select>
        <button type="button" onclick="setDefaultForSelectedWeek()" class="btn-action btn-gray" style="padding:8px 12px; font-size:0.8rem;">Mặc định</button>
    </div>`;

    html += `<div style="background:#fff; border:1.5px solid #3b82f6; border-radius:8px; padding:12px; margin-bottom:12px;">
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:10px; margin-bottom:10px;">
            <div><label style="display:block; font-size:0.75rem; font-weight:700; color:#1e40af; margin-bottom:4px;">HẠN NỘP</label>
            <input type="datetime-local" id="wd-submit-input" style="width:100%; padding:8px; border:1.5px solid #3b82f6; border-radius:6px; font-size:0.85rem;"></div>
            <div><label style="display:block; font-size:0.75rem; font-weight:700; color:#dc2626; margin-bottom:4px;">HẠN KHÓA</label>
            <input type="datetime-local" id="wd-lock-input" style="width:100%; padding:8px; border:1.5px solid #dc2626; border-radius:6px; font-size:0.85rem;"></div>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button type="button" onclick="saveWeekDeadlineFromForm()" class="btn-action btn-green" style="padding:9px 16px; flex:1;">Lưu</button>
            <button type="button" onclick="clearWeekDeadlineForSelected()" class="btn-action btn-red" style="padding:9px 16px; flex:1;">Xóa</button>
        </div>
        <div id="wd-status" style="margin-top:8px; font-size:0.82rem; font-weight:600;"></div>
    </div>`;

    const custom = Object.keys(STATE.weekDeadlines || {}).sort((a,b) => parseInt(a.replace(/\D/g,'')) - parseInt(b.replace(/\D/g,'')));
    if (custom.length) {
        html += `<div style="background:#fff; border:1px solid #cbd5e1; border-radius:8px; padding:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div style="font-weight:800; color:#1e40af; font-size:0.85rem;">Tuần đã đặt riêng (${custom.length})</div>
                <button type="button" onclick="clearAllWeekDeadlines()" class="btn-action btn-red" style="padding:4px 10px; font-size:0.72rem;">Xóa tất cả</button>
            </div>
            <table style="width:100%; border-collapse:collapse; font-size:0.78rem;">
                <thead><tr style="background:#eff6ff; color:#1e40af;">
                    <th style="padding:6px; border:1px solid #cbd5e1; text-align:left;">Tuần</th>
                    <th style="padding:6px; border:1px solid #cbd5e1;">Hạn nộp</th>
                    <th style="padding:6px; border:1px solid #cbd5e1;">Hạn khóa</th>
                    <th style="padding:6px; border:1px solid #cbd5e1; width:60px;">Xóa</th>
                </tr></thead><tbody>`;
        custom.forEach(w => {
            const ov = STATE.weekDeadlines[w];
            const sub = new Date(ov.submitDeadline);
            const lock = ov.lockDeadline ? new Date(ov.lockDeadline) : null;
            const fmt = d => isNaN(d) ? '?' : `${d.getDate()}/${d.getMonth()+1} ${String(d.getHours()).padStart(2,'0')}h`;
            const isLocked = lock && new Date() > lock;
            html += `<tr style="background:${isLocked ? '#fef2f2' : '#f0fdf4'};">
                <td style="padding:6px; border:1px solid #cbd5e1; font-weight:700;">${isLocked ? 'Khóa' : 'Mở'} - ${w}</td>
                <td style="padding:6px; border:1px solid #cbd5e1; text-align:center; color:#0369a1;">${fmt(sub)}</td>
                <td style="padding:6px; border:1px solid #cbd5e1; text-align:center; color:#dc2626; font-weight:700;">${fmt(lock)}</td>
                <td style="padding:6px; border:1px solid #cbd5e1; text-align:center;">
                    <button type="button" onclick="clearWeekDeadline('${w}')" class="btn-action btn-red" style="padding:3px 7px; font-size:0.7rem;">Xóa</button>
                </td></tr>`;
        });
        html += `</tbody></table></div>`;
    }

    container.innerHTML = html;
    loadWeekDeadlineToForm();
};

window.loadWeekDeadlineToForm = function() {
    const sel = document.getElementById('wd-week-select');
    const subEl = document.getElementById('wd-submit-input');
    const lockEl = document.getElementById('wd-lock-input');
    const statusEl = document.getElementById('wd-status');
    if (!sel || !subEl || !lockEl) return;
    const week = sel.value;
    const wNum = parseInt(week.replace(/\D/g, ''));
    const ov = STATE.weekDeadlines[week];
    if (ov?.submitDeadline) {
        subEl.value = dateToInput(new Date(ov.submitDeadline));
        lockEl.value = ov.lockDeadline ? dateToInput(new Date(ov.lockDeadline)) : '';
        if (statusEl) statusEl.innerHTML = '<span style="color:#16a34a;">Tuần này đã đặt riêng.</span>';
    } else {
        const def = getWeekDeadlines(wNum);
        subEl.value = dateToInput(def.submitDeadline);
        lockEl.value = dateToInput(def.lockDeadline);
        if (statusEl) statusEl.innerHTML = '<span style="color:#64748b;">Đang dùng mặc định.</span>';
    }
};

window.saveWeekDeadlineFromForm = function() {
    const sel = document.getElementById('wd-week-select');
    const subEl = document.getElementById('wd-submit-input');
    const lockEl = document.getElementById('wd-lock-input');
    const statusEl = document.getElementById('wd-status');
    if (!sel || !subEl?.value) return alert("Chọn hạn nộp!");
    const week = sel.value;
    const sub = new Date(subEl.value);
    const lock = lockEl.value ? new Date(lockEl.value) : null;
    if (isNaN(sub.getTime())) return alert("Hạn nộp không hợp lệ!");
    if (lock && isNaN(lock.getTime())) return alert("Hạn khóa không hợp lệ!");
    STATE.weekDeadlines[week] = {
        submitDeadline: sub.toISOString(),
        lockDeadline: lock ? lock.toISOString() : null
    };
    saveData('weekDeadlines', STATE.weekDeadlines);
    renderWeekDeadlinesManager();
    if (statusEl) statusEl.innerHTML = `<span style="color:#16a34a;">Đã lưu ${week}!</span>`;
};

window.clearWeekDeadline = function(week) {
    if (!confirm(`Xóa lịch riêng của ${week}?`)) return;
    delete STATE.weekDeadlines[week];
    saveData('weekDeadlines', STATE.weekDeadlines);
    renderWeekDeadlinesManager();
};

window.clearAllWeekDeadlines = function() {
    const n = Object.keys(STATE.weekDeadlines).length;
    if (!confirm(`Xóa TẤT CẢ ${n} lịch riêng?`)) return;
    STATE.weekDeadlines = {};
    saveData('weekDeadlines', STATE.weekDeadlines);
    renderWeekDeadlinesManager();
};

window.clearWeekDeadlineForSelected = function() {
    const sel = document.getElementById('wd-week-select');
    if (!sel) return;
    const week = sel.value;
    if (!STATE.weekDeadlines[week]) return alert(week + " chưa có lịch riêng.");
    clearWeekDeadline(week);
};

window.setDefaultForSelectedWeek = function() {
    const sel = document.getElementById('wd-week-select');
    const subEl = document.getElementById('wd-submit-input');
    const lockEl = document.getElementById('wd-lock-input');
    if (!sel || !subEl) return;
    const def = getWeekDeadlines(parseInt(sel.value.replace(/\D/g, '')));
    subEl.value = dateToInput(def.submitDeadline);
    lockEl.value = dateToInput(def.lockDeadline);
};

/* ============ QUẢN LÝ NỘI QUY ============ */
window.saveRulesConfig = function() {
    saveData('customRules', STATE.customRules);
    saveData('deletedRules', STATE.deletedRules);
};

window.renderRuleManager = function() {
    const c = document.getElementById('rule-manager-container');
    if (!c) return;
    rebuildErrorTypes();
    const grouped = {};
    ERROR_TYPES.forEach(r => {
        const g = r.group ?? 0;
        if (!grouped[g]) grouped[g] = [];
        grouped[g].push(r);
    });

    let html = '';
    html += '<div style="background:#ecfdf5; border:1.5px solid #10b981; padding:12px; border-radius:10px; margin-bottom:12px;">';
    html += '<h4 style="color:#047857; font-size:0.95rem; margin-bottom:10px;">THÊM NỘI QUY MỚI</h4>';
    html += '<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:8px; margin-bottom:8px;">';
    html += '<input type="text" id="new-rule-label" placeholder="Tên nội quy..." style="padding:8px; border-radius:6px; border:1.5px solid #a7f3d0; font-size:0.82rem;">';
    html += '<select id="new-rule-group" style="padding:8px; border-radius:6px; border:1.5px solid #a7f3d0; font-size:0.82rem;">';
    Object.keys(RULE_GROUPS).forEach(g => {
        html += '<option value="' + g + '">' + RULE_GROUPS[g].name + '</option>';
    });
    html += '</select>';
    html += '<select id="new-rule-type" style="padding:8px; border-radius:6px; border:1.5px solid #a7f3d0; font-size:0.82rem;">';
    html += '<option value="sub">Điểm trừ</option><option value="add">Điểm cộng</option>';
    html += '</select>';
    html += '<input type="number" id="new-rule-points" placeholder="Điểm" min="1" value="5" style="padding:8px; border-radius:6px; border:1.5px solid #a7f3d0; font-size:0.82rem;">';
    html += '</div>';
    html += '<button type="button" onclick="addNewRule()" class="btn-action btn-green" style="width:100%; padding:10px; font-size:0.9rem;">Thêm nội quy</button>';
    html += '</div>';

    html += '<div style="background:#fff; border:1.5px solid #cbd5e1; border-radius:10px; padding:12px;">';
    html += '<h4 style="color:#1e40af; font-size:0.95rem; margin-bottom:10px;">DANH SÁCH (' + ERROR_TYPES.length + ' mục)</h4>';

    Object.keys(grouped).map(Number).sort((a,b) => a-b).forEach(g => {
        const gr = RULE_GROUPS[g] || { name: 'Nhóm ' + g, color: '#64748b' };
        html += '<div style="margin-bottom:14px;">';
        html += '<div style="background:' + gr.color + '15; border-left:4px solid ' + gr.color + '; padding:6px 10px; border-radius:6px; font-weight:800; font-size:0.82rem; color:' + gr.color + '; margin-bottom:6px;">' + gr.name + '</div>';
        html += '<table style="width:100%; border-collapse:collapse; font-size:0.78rem;">';
        grouped[g].forEach(r => {
            const isAdd = (typeof r.pen === 'number' && r.pen < 0) || r.pen === 'custom_add' || r.isBonus;
            const isEditing = (window.editingRuleKey === r.key);
            const isCustom = STATE.customRules.some(x => x.key === r.key && !x.isOverride);
            const isOverride = STATE.customRules.some(x => x.key === r.key && x.isOverride);
            let penText = '?';
            if (r.pen === 'custom_add') penText = '+?';
            else if (r.pen === 'custom_sub') penText = '-?';
            else if (typeof r.pen === 'number') penText = isAdd ? '+' + Math.abs(r.pen) + 'đ' : '-' + r.pen + 'đ';
            const penColor = isAdd ? '#16a34a' : '#dc2626';
            let badge = '';
            if (isCustom) badge = '<span style="background:#fef3c7; color:#92400e; padding:1px 6px; border-radius:4px; font-size:0.62rem; font-weight:700; margin-left:4px;">Mới</span>';
            if (isOverride) badge = '<span style="background:#dbeafe; color:#1e40af; padding:1px 6px; border-radius:4px; font-size:0.62rem; font-weight:700; margin-left:4px;">Đã sửa</span>';

            html += '<tr style="border-bottom:1px solid #f1f5f9;">';
            if (isEditing) {
                html += '<td colspan="3" style="padding:10px; background:#fffbeb;">';
                html += '<input type="text" id="edit-label-' + r.key + '" value="' + (r.label || '').replace(/"/g,'&quot;') + '" style="width:100%; padding:6px 8px; border:1.5px solid #fbbf24; border-radius:5px; font-size:0.8rem; margin-bottom:6px;">';
                html += '<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; margin-bottom:6px;">';
                html += '<select id="edit-group-' + r.key + '" style="padding:6px; border:1.5px solid #fbbf24; border-radius:5px; font-size:0.78rem;">';
                Object.keys(RULE_GROUPS).forEach(gn => {
                    html += '<option value="' + gn + '" ' + (parseInt(gn) === parseInt(r.group) ? 'selected' : '') + '>' + RULE_GROUPS[gn].name + '</option>';
                });
                html += '</select>';
                html += '<select id="edit-type-' + r.key + '" style="padding:6px; border:1.5px solid #fbbf24; border-radius:5px; font-size:0.78rem;">';
                html += '<option value="sub" ' + (!isAdd ? 'selected' : '') + '>Trừ</option>';
                html += '<option value="add" ' + (isAdd ? 'selected' : '') + '>Cộng</option>';
                html += '</select>';
                const ptsVal = typeof r.pen === 'number' ? Math.abs(r.pen) : 5;
                html += '<input type="number" id="edit-points-' + r.key + '" value="' + ptsVal + '" min="1" style="padding:6px; border:1.5px solid #fbbf24; border-radius:5px; font-size:0.78rem;">';
                html += '</div>';
                html += '<div style="display:flex; gap:6px;">';
                html += '<button type="button" onclick="saveEditRule(\'' + r.key + '\')" class="btn-action btn-green" style="flex:1; padding:6px; font-size:0.78rem;">Lưu</button>';
                html += '<button type="button" onclick="cancelEditRule()" class="btn-action btn-gray" style="flex:1; padding:6px; font-size:0.78rem;">Hủy</button>';
                html += '</div></td>';
            } else {
                html += '<td style="padding:6px 8px;">' + r.label + badge + '</td>';
                html += '<td style="padding:6px 8px; text-align:center; width:70px; font-weight:800; color:' + penColor + ';">' + penText + '</td>';
                html += '<td style="padding:6px 8px; text-align:center; width:110px; white-space:nowrap;">';
                html += '<button type="button" onclick="startEditRule(\'' + r.key + '\')" style="background:#dbeafe; color:#1e40af; border:1px solid #93c5fd; padding:3px 7px; border-radius:4px; font-size:0.7rem; cursor:pointer; margin-right:3px;">Sửa</button>';
                html += '<button type="button" onclick="deleteRule(\'' + r.key + '\')" style="background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; padding:3px 7px; border-radius:4px; font-size:0.7rem; cursor:pointer;">Xóa</button>';
                html += '</td>';
            }
            html += '</tr>';
        });
        html += '</table></div>';
    });
    html += '</div>';
    html += '<div style="margin-top:10px;"><button type="button" onclick="resetAllRules()" class="btn-action btn-red" style="padding:8px 14px; font-size:0.8rem;">Khôi phục nội quy gốc</button></div>';
    c.innerHTML = html;
};

window.addNewRule = function() {
    const label = document.getElementById('new-rule-label').value.trim();
    const group = parseInt(document.getElementById('new-rule-group').value);
    const type = document.getElementById('new-rule-type').value;
    const points = parseInt(document.getElementById('new-rule-points').value);
    if (!label) return alert("Nhập tên!");
    if (!points || points <= 0 || points > 500) return alert("Điểm 1-500!");
    const pen = (type === 'add') ? -points : points;
    const key = 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    STATE.customRules.push({ key, label, pen, group, isCustom: true });
    saveRulesConfig();
    renderRuleManager();
    document.getElementById('new-rule-label').value = '';
    alert('Đã thêm: ' + label);
};

window.startEditRule = function(key) {
    window.editingRuleKey = key;
    renderRuleManager();
    setTimeout(() => document.getElementById('edit-label-' + key)?.focus(), 100);
};
window.cancelEditRule = function() {
    window.editingRuleKey = null;
    renderRuleManager();
};
window.saveEditRule = function(key) {
    const label = document.getElementById('edit-label-' + key).value.trim();
    const group = parseInt(document.getElementById('edit-group-' + key).value);
    const type = document.getElementById('edit-type-' + key).value;
    const points = parseInt(document.getElementById('edit-points-' + key).value);
    if (!label) return alert("Tên không rỗng!");
    if (!points || points <= 0 || points > 500) return alert("Điểm 1-500!");
    const pen = (type === 'add') ? -points : points;
    const isBase = DEFAULT_ERROR_TYPES.some(r => r.key === key);
    const cidx = STATE.customRules.findIndex(r => r.key === key);
    if (cidx > -1) {
        STATE.customRules[cidx].label = label;
        STATE.customRules[cidx].pen = pen;
        STATE.customRules[cidx].group = group;
    } else if (isBase) {
        STATE.customRules.push({ key, label, pen, group, isOverride: true });
    }
    saveRulesConfig();
    window.editingRuleKey = null;
    renderRuleManager();
    alert('Đã cập nhật!');
};

window.deleteRule = function(key) {
    const rule = ERROR_TYPES.find(r => r.key === key);
    if (!rule) return;
    if (!confirm('Xóa nội quy: "' + rule.label + '"?\n\nĐiểm đã chấm trước đó vẫn giữ nguyên.')) return;
    const cidx = STATE.customRules.findIndex(r => r.key === key);
    if (cidx > -1) STATE.customRules.splice(cidx, 1);
    if (!STATE.deletedRules.includes(key)) STATE.deletedRules.push(key);
    saveRulesConfig();
    renderRuleManager();
};

window.resetAllRules = function() {
    if (!confirm('Khôi phục TẤT CẢ nội quy về mặc định?')) return;
    STATE.customRules = [];
    STATE.deletedRules = [];
    saveRulesConfig();
    location.reload();
};

console.log('%c[OK] ADMIN FUNCTIONS LOADED (Phần 3C/4)', 'color:#16a34a; font-weight:bold; font-size:14px;');
/* ============================================================
   PHẦN 4/4: TKB AI + CONTEST + SUPER ADMIN + BANNER + INIT
============================================================ */

/* ============ TKB MANAGER (AI đọc ảnh) ============ */
const TKB_THU = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

window.saveTkb = function() {
    saveData('tkb', STATE.tkb);
};

window.renderTkbManagerUI = function() {
    const container = document.getElementById('tkb-manager-container');
    if (!container) return;

    container.innerHTML = `
        <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:12px;">Chọn ảnh TKB → AI đọc → sửa nếu cần → lưu.</p>

        <div style="background:#faf5ff; border:1.5px solid #8b5cf6; border-radius:10px; padding:12px; margin-bottom:12px;">
            <div style="font-weight:800; color:#6b21a8; font-size:0.9rem; margin-bottom:8px;">CHỌN ẢNH TKB (tối đa 5 ảnh)</div>
            <input type="file" id="tkb-image-input" accept="image/*" multiple style="display:none;" onchange="handleTkbImageSelect(event)">
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <button onclick="document.getElementById('tkb-image-input').click()" class="btn-action btn-purple" style="padding:8px 16px; font-size:0.85rem;">Chọn ảnh</button>
                <button onclick="clearTkbImages()" class="btn-action btn-red" style="padding:8px 16px; font-size:0.85rem;">Xóa hết</button>
            </div>
            <div id="tkb-image-preview" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(100px,1fr)); gap:8px; margin-top:10px;"></div>
        </div>

        <div style="background:#eff6ff; border:1.5px solid #3b82f6; border-radius:10px; padding:12px; margin-bottom:12px;">
            <button id="tkb-read-btn" onclick="readTkbWithAI()" class="btn-action btn-primary" style="width:100%; padding:12px; font-size:0.95rem;">ĐỌC TKB BẰNG AI</button>
            <div id="tkb-progress" style="display:none; height:8px; background:#e2e8f0; border-radius:4px; overflow:hidden; margin-top:8px;"><div style="height:100%; background:linear-gradient(90deg,#16a34a,#22c55e); width:0%; transition:width 0.3s;"></div></div>
            <div id="tkb-status" style="margin-top:8px; font-size:0.82rem;"></div>
        </div>

        <div id="tkb-result" style="display:none; background:#fff; border:1.5px solid #cbd5e1; border-radius:10px; padding:12px;">
            <div style="display:flex; gap:8px; align-items:center; margin-bottom:10px; flex-wrap:wrap;">
                <label style="font-weight:800; color:#1e293b; font-size:0.85rem;">Số tiết:</label>
                <input type="number" id="tkb-num-tiet" value="5" min="1" max="12" style="width:70px; padding:6px; border:1.5px solid #cbd5e1; border-radius:6px; font-weight:800; text-align:center;">
                <button onclick="applyTkbNumTiet()" class="btn-action btn-primary" style="padding:6px 12px; font-size:0.8rem;">Áp dụng</button>
            </div>
            <div id="tkb-editable-table" style="margin-bottom:10px;"></div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <button onclick="saveTkbFromTable()" class="btn-action btn-green" style="flex:1; min-width:150px; padding:10px; font-size:0.9rem;">LƯU TKB</button>
                <button onclick="clearTkb()" class="btn-action btn-red" style="flex:1; min-width:150px; padding:10px; font-size:0.9rem;">XÓA TKB</button>
            </div>
        </div>
    `;
    if (STATE.tkb?.data && STATE.tkb.data.length) {
               const hasData = STATE.tkb.data.some(r => r.some(c => c && c.mon));
        if (hasData) renderTkbEditable();
    }
    renderTkbByWeekUI();
};

window._tkbImages = [];
window.handleTkbImageSelect = function(ev) {
    const files = Array.from(ev.target.files || []);
    if (!files.length) return;
    if (window._tkbImages.length + files.length > 5) return alert('Tối đa 5 ảnh!');
    window._tkbImages = window._tkbImages.concat(files);
    renderTkbImagePreview();
    ev.target.value = '';
};
window.removeTkbImage = function(i) { window._tkbImages.splice(i, 1); renderTkbImagePreview(); };
window.clearTkbImages = function() {
    if (!window._tkbImages.length) return;
    if (!confirm('Xóa hết ảnh đã chọn?')) return;
    window._tkbImages = [];
    renderTkbImagePreview();
};
function renderTkbImagePreview() {
    const g = document.getElementById('tkb-image-preview');
    if (!g) return;
    g.innerHTML = '';
    window._tkbImages.forEach((f, i) => {
        const r = new FileReader();
        r.onload = e => {
            const d = document.createElement('div');
            d.style.cssText = 'position:relative;border:1px solid #cbd5e1;border-radius:8px;overflow:hidden;aspect-ratio:1;background:#f8fafc;';
            d.innerHTML = '<img src="' + e.target.result + '" style="width:100%;height:100%;object-fit:cover;">'
                + '<button onclick="removeTkbImage(' + i + ')" style="position:absolute;top:4px;right:4px;background:#dc2626;color:#fff;border:none;width:24px;height:24px;border-radius:50%;cursor:pointer;font-weight:900;font-size:0.75rem;">×</button>';
            g.appendChild(d);
        };
        r.readAsDataURL(f);
    });
}

function loadTesseract() {
    if (window.Tesseract) return Promise.resolve();
    return new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
        s.onload = res;
        s.onerror = () => rej(new Error('Không tải được Tesseract'));
        document.head.appendChild(s);
    });
}

async function ocrImages(files) {
    await loadTesseract();
    let all = '';
    for (let i = 0; i < files.length; i++) {
        const st = document.getElementById('tkb-status');
        if (st) st.innerHTML = '<div style="color:#0369a1;">Đang OCR ảnh ' + (i+1) + '/' + files.length + '...</div>';
        const { data } = await Tesseract.recognize(files[i], 'vie+eng', {
            logger: m => {
                if (m.status === 'recognizing text' && st) {
                    st.innerHTML = '<div style="color:#0369a1;">OCR ảnh ' + (i+1) + '/' + files.length + ': ' + Math.round(m.progress*100) + '%</div>';
                }
            }
        });
        all += '\n=== ẢNH ' + (i+1) + ' ===\n' + data.text;
    }
    return all;
}

async function callDeepSeek(text) {
    const key = STATE.systemConfig?.deepseekKey || '';
    if (!key) throw new Error('Hệ thống chưa cấu hình AI. Liên hệ chủ hệ thống.');

    const prompt = 'Đây là text OCR của thời khóa biểu lớp học Việt Nam. Hãy chuyển thành JSON.\n\n'
        + 'ĐỊNH DẠNG (JSON thuần, không markdown):\n'
        + '{\n  "numTiet": <4-6>,\n  "data": [\n    [ {"mon":"","gv":""}, ... 6 phần tử cho T2→T7 ],\n    ... (numTiet dòng)\n  ]\n}\n\n'
        + 'QUY TẮC:\n'
        + '- "mon" = mã môn (TO, VA, LY, HO, SU, TI, GDTC, HĐTN,...)\n'
        + '- "gv" = tên GV viết tắt\n'
        + '- Ô trống → {"mon":"","gv":""}\n'
        + '- LUÔN có 6 cột (T2→T7), thiếu thì thêm cột trống\n'
        + '- Bỏ header\n\n'
        + 'TEXT OCR:\n' + text;

    const r = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: 'Bạn là trợ lý chuyển TKB. Luôn trả về JSON hợp lệ.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.1,
            response_format: { type: 'json_object' }
        })
    });
    if (!r.ok) throw new Error('DeepSeek API lỗi ' + r.status + ': ' + (await r.text()).slice(0,200));
    const j = await r.json();
    const c = j.choices?.[0]?.message?.content || '{}';
    try { return JSON.parse(c); } catch(e) { throw new Error('AI trả về không phải JSON'); }
}

window.readTkbWithAI = async function() {
    if (!STATE.systemConfig?.deepseekKey) return alert('Hệ thống chưa cấu hình AI. Liên hệ chủ hệ thống.');
    if (!window._tkbImages.length) return alert('Chưa chọn ảnh!');

    const btn = document.getElementById('tkb-read-btn');
    const st = document.getElementById('tkb-status');
    const pg = document.getElementById('tkb-progress');
    btn.disabled = true;
    pg.style.display = 'block';
    pg.querySelector('div').style.width = '5%';
    st.innerHTML = '<div style="color:#0369a1;">Bắt đầu...</div>';

    try {
        pg.querySelector('div').style.width = '15%';
        const text = await ocrImages(window._tkbImages);
        pg.querySelector('div').style.width = '70%';
        st.innerHTML = '<div style="color:#0369a1;">Đang gửi cho DeepSeek...</div>';
        const result = await callDeepSeek(text);
        pg.querySelector('div').style.width = '100%';

        if (result.data && Array.isArray(result.data)) {
            STATE.tkb.numTiet = Math.max(1, Math.min(12, parseInt(result.numTiet) || result.data.length));
            STATE.tkb.data = result.data.map(row =>
                TKB_THU.map((_, i) => {
                    const c = row[i] || {};
                    return { mon: String(c.mon || '').trim(), gv: String(c.gv || '').trim() };
                })
            );
            document.getElementById('tkb-result').style.display = 'block';
            renderTkbEditable();
            st.innerHTML = '<div style="color:#16a34a;font-weight:700;">Đọc thành công! Sửa nếu cần rồi bấm LƯU TKB.</div>';
        } else throw new Error('AI không trả data hợp lệ');
    } catch(err) {
        st.innerHTML = '<div style="color:#dc2626;font-weight:700;">Lỗi: ' + err.message + '</div>';
    } finally {
        btn.disabled = false;
        setTimeout(() => { pg.style.display = 'none'; pg.querySelector('div').style.width = '0%'; }, 2000);
    }
};

window.renderTkbEditable = function() {
    const box = document.getElementById('tkb-result');
    if (!box) return;
    box.style.display = 'block';
    const nEl = document.getElementById('tkb-num-tiet');
    if (nEl) nEl.value = STATE.tkb.numTiet;

    let html = '<div style="overflow-x:auto;border-radius:8px;"><table style="width:100%;border-collapse:collapse;font-size:0.82rem;min-width:700px;">';
    html += '<thead><tr><th style="background:#dc2626;color:#fff;padding:10px;border:1px solid #cbd5e1;width:80px;">TIẾT</th>';
    TKB_THU.forEach(t => html += '<th style="background:#1e3a8a;color:#fff;padding:10px;border:1px solid #cbd5e1;">' + t.toUpperCase() + '</th>');
    html += '</tr></thead><tbody>';
    for (let r = 0; r < STATE.tkb.numTiet; r++) {
        html += '<tr><td style="background:#fef2f2;color:#991b1b;font-weight:800;padding:8px;border:1px solid #cbd5e1;text-align:center;">Tiết ' + (r+1) + '</td>';
        for (let c = 0; c < 6; c++) {
            const cell = STATE.tkb.data[r]?.[c] || { mon:'', gv:'' };
            html += '<td style="padding:6px;border:1px solid #e2e8f0;background:#fff;">'
                + '<input type="text" value="' + cell.mon.replace(/"/g,'&quot;') + '" onchange="updateTkbCell(' + r + ',' + c + ',\'mon\',this.value)" placeholder="Môn" style="width:100%;padding:5px;border:1px solid #e2e8f0;border-radius:4px;font-weight:700;color:#1e293b;font-size:0.82rem;text-align:center;outline:none;background:#f8fafc;">'
                + '<input type="text" value="' + cell.gv.replace(/"/g,'&quot;') + '" onchange="updateTkbCell(' + r + ',' + c + ',\'gv\',this.value)" placeholder="GV" style="width:100%;padding:3px;margin-top:3px;border:none;font-size:0.72rem;color:#64748b;text-align:center;outline:none;background:transparent;">'
                + '</td>';
        }
        html += '</tr>';
    }
    html += '</tbody></table></div>';
    document.getElementById('tkb-editable-table').innerHTML = html;
};

window.updateTkbCell = function(r, c, f, v) {
    if (!STATE.tkb.data[r]) STATE.tkb.data[r] = TKB_THU.map(() => ({ mon:'', gv:'' }));
    if (!STATE.tkb.data[r][c]) STATE.tkb.data[r][c] = { mon:'', gv:'' };
    STATE.tkb.data[r][c][f] = v.trim();
};

window.applyTkbNumTiet = function() {
    const n = parseInt(document.getElementById('tkb-num-tiet').value) || 5;
    if (n < 1 || n > 12) return alert('Số tiết 1-12!');
    STATE.tkb.numTiet = n;
    while (STATE.tkb.data.length < n) STATE.tkb.data.push(TKB_THU.map(() => ({ mon:'', gv:'' })));
    while (STATE.tkb.data.length > n) STATE.tkb.data.pop();
    renderTkbEditable();
};

function tkbHasData(tkb) {
    if (!tkb || !tkb.data) return false;
    return tkb.data.some(r => r.some(c => c && c.mon && c.mon.trim()));
}

window.saveTkbFromTable = function() {
    if (!tkbHasData(STATE.tkb)) return alert('Bảng TKB đang trống!');
    let oldTkb = null;
    try { const s = localStorage.getItem('tkb'); if (s) oldTkb = JSON.parse(s); } catch(e) {}
    if (tkbHasData(oldTkb)) {
        if (!confirm('Đã có TKB cũ. Ghi đè bằng TKB mới?')) return;
    }
    saveTkb();
    renderTkbPublic();
    renderTkbEditable();
    alert('Đã lưu TKB mới!');
};

window.clearTkb = function() {
    if (!confirm('Xóa toàn bộ TKB?')) return;
    STATE.tkb = { numTiet: 5, data: Array.from({length:5}, () => TKB_THU.map(() => ({ mon:'', gv:'' }))) };
    saveTkb();
    renderTkbEditable();
    renderTkbPublic();
};

/* ============ CONTEST MANAGER ============ */
window.renderContestManagerUI = function() {
    const container = document.getElementById('contest-manager-container');
    if (!container) return;

    container.innerHTML = `
        <div style="background:#fff7ed; border:1.5px solid #f97316; padding:14px; border-radius:12px; margin-bottom:14px;">
            <h4 style="color:#9a3412; font-size:1rem; margin-bottom:10px;">TẠO CUỘC THI MỚI</h4>
            <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:8px;">
                <div class="form-group" style="margin:0;"><label>Tên cuộc thi</label><input type="text" id="pc-name" placeholder="VD: Ảnh ATGT 2026"></div>
                <div class="form-group" style="margin:0;"><label>Hạn nộp</label><input type="datetime-local" id="pc-deadline"></div>
                <div class="form-group" style="margin:0;"><label>Số ảnh tối đa</label><input type="number" id="pc-max" value="3" min="1" max="20"></div>
            </div>
            <button class="btn-action btn-orange" style="width:100%; margin-top:8px;" onclick="createPhotoContest()">Tạo cuộc thi mới</button>
        </div>

        <div class="table-responsive" style="max-height:300px;">
            <table>
                <thead><tr style="background:#fed7aa; color:#9a3412;">
                    <th style="width:40px;">STT</th>
                    <th style="text-align:left;">Tên cuộc thi</th>
                    <th style="width:130px;">Hạn nộp</th>
                    <th style="width:70px;">Max</th>
                    <th style="width:100px;">Trạng thái</th>
                    <th style="width:130px;">Thao tác</th>
                </tr></thead>
                <tbody id="admin-contest-tbody"></tbody>
            </table>
        </div>

        <div style="margin-top:14px; padding-top:14px; border-top:1px dashed #f97316;">
            <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap; margin-bottom:10px;">
                <label style="font-weight:700; color:#9a3412; font-size:0.85rem;">Theo dõi:</label>
                <select id="admin-track-contest" onchange="renderPhotoTracking()" style="padding:6px; border-radius:6px; border:1px solid #f97316; font-weight:600; min-width:150px;"></select>
                <button class="btn-action btn-primary" style="padding:6px 12px; font-size:0.78rem;" onclick="renderPhotoTracking()">Tải lại</button>
            </div>
            <div class="table-responsive" style="max-height:400px;">
                <table>
                    <thead><tr style="background:#ffedd5; color:#9a3412;">
                        <th style="width:45px;">STT</th>
                        <th style="text-align:left;">Học sinh</th>
                        <th style="width:80px;">Số ảnh</th>
                        <th style="width:130px;">Trạng thái</th>
                        <th style="width:140px;">Thời gian</th>
                        <th style="width:110px;">Drive</th>
                    </tr></thead>
                    <tbody id="admin-photo-tracking-tbody"><tr><td colspan="6" style="padding:12px; font-style:italic; color:#9a3412;">Chọn cuộc thi để xem.</td></tr></tbody>
                </table>
            </div>
        </div>

        <div style="margin-top:16px; padding-top:14px; border-top:2px dashed #f97316;">
            <h5 style="color:#9a3412; font-size:0.95rem; margin-bottom:8px;">SOẠN TIN NHẮN NHẮC NHỞ</h5>
            <div style="background:#fff; border:1px dashed #f97316; border-radius:8px; padding:10px; margin-bottom:8px;">
                <div style="font-size:0.75rem; color:#7c2d12; margin-bottom:6px; font-weight:600;">Bấm nút để chèn biến tự động</div>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    <button type="button" class="btn-action btn-purple" style="padding:6px 10px; font-size:0.72rem;" onclick="generateMissingMessage()">Tạo tin tự động</button>
                    <button type="button" class="btn-action btn-primary" style="padding:6px 10px; font-size:0.72rem;" onclick="insertMsgVar('{ten_lop}')">+ Lớp</button>
                    <button type="button" class="btn-action btn-primary" style="padding:6px 10px; font-size:0.72rem;" onclick="insertMsgVar('{ten_cuoc_thi}')">+ Cuộc thi</button>
                    <button type="button" class="btn-action btn-primary" style="padding:6px 10px; font-size:0.72rem;" onclick="insertMsgVar('{han_nop}')">+ Hạn</button>
                    <button type="button" class="btn-action btn-primary" style="padding:6px 10px; font-size:0.72rem;" onclick="insertMsgVar('{danh_sach_chua_nop}')">+ DS chưa nộp</button>
                    <button type="button" class="btn-action btn-primary" style="padding:6px 10px; font-size:0.72rem;" onclick="insertMsgVar('{so_luong}')">+ Số lượng</button>
                    <button type="button" class="btn-action btn-primary" style="padding:6px 10px; font-size:0.72rem;" onclick="insertMsgVar('{ten_gv}')">+ Tên GV</button>
                </div>
            </div>
            <textarea id="missing-msg-textarea" rows="9" placeholder="Bấm 'Tạo tin tự động'..." style="width:100%; padding:10px; font-size:0.83rem; border-radius:8px; border:1.5px solid #f97316; font-family:inherit; outline:none; resize:vertical; background:#fff; line-height:1.5;"></textarea>
            <div id="msg-preview-info" style="margin-top:6px; font-size:0.75rem; color:#7c2d12; font-style:italic;"></div>
            <div style="display:flex; gap:8px; margin-top:10px; flex-wrap:wrap;">
                <button type="button" class="btn-action btn-green" style="flex:1; min-width:150px;" onclick="copyMissingMsg()">Copy tin chung</button>
                <button type="button" class="btn-action btn-red" style="flex:1; min-width:150px;" onclick="copyEachStudentMsg()">Copy tin riêng</button>
                <button type="button" class="btn-action btn-gray" style="min-width:100px;" onclick="document.getElementById('missing-msg-textarea').value=''">Xóa</button>
            </div>
            <div id="missing-msg-status" style="margin-top:8px; font-size:0.82rem; font-weight:600;"></div>
        </div>
    `;
    renderAdminContestManager();
    const ta = document.getElementById('missing-msg-textarea');
    if (ta) ta.addEventListener('input', _updateMsgPreview);
    const trackSel = document.getElementById('admin-track-contest');
    if (trackSel) {
        trackSel.addEventListener('change', () => {
            const ta2 = document.getElementById('missing-msg-textarea');
            if (ta2 && !ta2.value.trim()) ta2.value = MSG_TEMPLATE_DEFAULT;
            _updateMsgPreview();
        });
    }
};

window.renderAdminContestManager = function() {
    const tbody = document.getElementById('admin-contest-tbody');
    const trackSel = document.getElementById('admin-track-contest');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (trackSel) trackSel.innerHTML = '<option value="">-- Chọn --</option>';
    const list = Object.entries(STATE.photoContests || {});
    if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="padding:12px; font-style:italic; color:#9a3412;">Chưa có cuộc thi.</td></tr>';
        return;
    }
    list.sort((a, b) => (b[1].createdAt || '').localeCompare(a[1].createdAt || ''));
    list.forEach(([id, c], idx) => {
        const dl = new Date(c.deadline);
        const dlStr = isNaN(dl) ? '?' : `${dl.getDate()}/${dl.getMonth()+1} ${dl.getHours()}h${String(dl.getMinutes()).padStart(2,'0')}`;
        const expired = new Date() > dl;
        const badge = c.active
            ? (expired ? '<span style="color:#92400e; font-weight:700;">Hết hạn</span>' : '<span style="color:#166534; font-weight:700;">Đang mở</span>')
            : '<span style="color:#64748b; font-weight:700;">Đã đóng</span>';
        tbody.innerHTML += `<tr>
            <td>${idx+1}</td>
            <td style="text-align:left; font-weight:600;">${c.name}</td>
            <td>${dlStr}</td>
            <td>${c.maxPhotos}</td>
            <td>${badge}</td>
            <td>
                <button class="btn-action" style="background:${c.active?'#64748b':'#16a34a'}; padding:4px 8px; font-size:0.72rem; margin:1px;" onclick="toggleContestActive('${id}')">${c.active?'Đóng':'Mở'}</button>
                <button class="btn-action btn-red" style="padding:4px 8px; font-size:0.72rem; margin:1px;" onclick="deleteContest('${id}')">Xóa</button>
            </td></tr>`;
        if (trackSel) trackSel.innerHTML += `<option value="${id}">${c.name}</option>`;
    });
};

window.createPhotoContest = function() {
    const name = document.getElementById('pc-name').value.trim();
    const deadline = document.getElementById('pc-deadline').value;
    const max = parseInt(document.getElementById('pc-max').value) || 3;
    if (!name) return alert("Nhập tên cuộc thi!");
    if (!deadline) return alert("Chọn hạn nộp!");
    const id = 'contest_' + Date.now();
    STATE.photoContests[id] = { name, deadline, maxPhotos: max, active: true, createdAt: new Date().toISOString() };
    saveData('photoContests', STATE.photoContests);
    document.getElementById('pc-name').value = '';
    document.getElementById('pc-deadline').value = '';
    document.getElementById('pc-max').value = 3;
    renderAdminContestManager();
    renderPublicPhotoSection();
    alert("Đã tạo!");
};

window.toggleContestActive = function(id) {
    if (!STATE.photoContests[id]) return;
    STATE.photoContests[id].active = !STATE.photoContests[id].active;
    saveData('photoContests', STATE.photoContests);
    renderAdminContestManager();
    renderPublicPhotoSection();
};

window.deleteContest = function(id) {
    if (!confirm("Xóa cuộc thi này?")) return;
    delete STATE.photoContests[id];
    if (STATE.photoSubmissions[id]) delete STATE.photoSubmissions[id];
    saveData('photoContests', STATE.photoContests);
    saveData('photoSubmissions', STATE.photoSubmissions);
    renderAdminContestManager();
    renderPublicPhotoSection();
};

window.renderPhotoTracking = function() {
    const cid = document.getElementById('admin-track-contest').value;
    const tbody = document.getElementById('admin-photo-tracking-tbody');
    if (!tbody) return;
    if (!cid || !STATE.photoContests[cid]) {
        tbody.innerHTML = '<tr><td colspan="6" style="padding:12px; font-style:italic; color:#9a3412;">Chọn cuộc thi.</td></tr>';
        return;
    }
    const subs = STATE.photoSubmissions[cid] || {};
    const deadline = new Date(STATE.photoContests[cid].deadline);
    tbody.innerHTML = '';
    let doneCount = 0;
    STATE.students.forEach((name, idx) => {
        const stt = idx + 1;
        const sub = subs[stt];
        let statusHtml, timeStr = '-';
        if (sub) {
            doneCount++;
            const late = new Date(sub.submittedAt) > deadline;
            statusHtml = late ? '<span class="status-badge-late">Nộp muộn</span>' : '<span class="status-badge-done">Đã nộp</span>';
            const d = new Date(sub.submittedAt);
            timeStr = `${d.getDate()}/${d.getMonth()+1} ${d.getHours()}h${String(d.getMinutes()).padStart(2,'0')}`;
        } else statusHtml = '<span class="status-badge-miss">Chưa nộp</span>';
        tbody.innerHTML += `<tr>
            <td>${stt}</td>
            <td style="text-align:left; font-weight:600;">${name}</td>
            <td>${sub ? sub.count : 0}</td>
            <td>${statusHtml}</td>
            <td>${timeStr}</td>
            <td>${sub?.folderUrl ? `<a href="${sub.folderUrl}" target="_blank" class="btn-action" style="background:#0ea5e9; padding:4px 8px; font-size:0.72rem; text-decoration:none;">Drive</a>` : '-'}</td>
        </tr>`;
    });
    tbody.innerHTML = `<tr style="background:#fef3c7; font-weight:700; color:#92400e;"><td colspan="6" style="padding:8px; text-align:center;">Đã nộp: ${doneCount}/${STATE.students.length}</td></tr>` + tbody.innerHTML;
};

/* ============ TIN NHẮN NHẮC NHỞ ============ */
window.insertMsgVar = function(varName) {
    const ta = document.getElementById('missing-msg-textarea');
    if (!ta) return;
    const s = ta.selectionStart || 0, e = ta.selectionEnd || 0;
    ta.value = ta.value.slice(0, s) + varName + ta.value.slice(e);
    ta.focus();
    ta.selectionStart = ta.selectionEnd = s + varName.length;
};

window.generateMissingMessage = function() {
    const cid = document.getElementById('admin-track-contest')?.value;
    if (!cid) return alert("Chọn cuộc thi trước!");
    const ta = document.getElementById('missing-msg-textarea');
    if (ta.value.trim() && !confirm("Thay thế nội dung?")) return;
    ta.value = MSG_TEMPLATE_DEFAULT;
    _updateMsgPreview();
};

function _getMissingData() {
    const cid = document.getElementById('admin-track-contest')?.value;
    if (!cid) return null;
    const subs = STATE.photoSubmissions[cid] || {};
    const missing = [], submitted = [];
    STATE.students.forEach((name, idx) => {
        const stt = idx + 1;
        if (subs[stt]) submitted.push(name);
        else missing.push({ stt, name });
    });
    return { cid, contest: STATE.photoContests[cid], missing, submitted, total: STATE.students.length };
}

function _fillTemplate(template, missingList) {
    const data = _getMissingData();
    if (!data) return "";
    const c = data.contest;
    const dl = new Date(c.deadline);
    const dlStr = `${String(dl.getHours()).padStart(2,'0')}h${String(dl.getMinutes()).padStart(2,'0')} ngày ${dl.getDate()}/${dl.getMonth()+1}/${dl.getFullYear()}`;
    const ds = missingList.map((m, i) => `${i+1}. ${m.name}`).join('\n');
    return template
        .replace(/\{ten_lop\}/g, STATE.config.className || '')
        .replace(/\{ten_cuoc_thi\}/g, c.name)
        .replace(/\{han_nop\}/g, dlStr)
        .replace(/\{danh_sach_chua_nop\}/g, ds)
        .replace(/\{so_luong\}/g, missingList.length)
        .replace(/\{ten_gv\}/g, STATE.config.teacherName || 'GVCN');
}

function _updateMsgPreview() {
    const data = _getMissingData();
    const info = document.getElementById('msg-preview-info');
    if (!info || !data) return;
    if (!data.missing.length) {
        info.innerHTML = 'Tất cả đã nộp!';
        info.style.color = '#166534';
        return;
    }
    info.innerHTML = `Sẽ nhắc <b>${data.missing.length}</b> HS (đã nộp: ${data.submitted.length}/${data.total}).`;
    info.style.color = '#7c2d12';
}

window.copyMissingMsg = function() {
    const ta = document.getElementById('missing-msg-textarea');
    const status = document.getElementById('missing-msg-status');
    if (!ta?.value.trim()) return alert("Chưa có nội dung!");
    const data = _getMissingData();
    if (!data) return alert("Chưa chọn cuộc thi!");
    if (!data.missing.length) return status.innerHTML = '<span style="color:#166534;">Tất cả đã nộp!</span>';
    const finalMsg = _fillTemplate(ta.value, data.missing);
    if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(finalMsg).then(() => {
            status.innerHTML = `<span style="color:#166534;">Đã copy (${data.missing.length} HS)!</span>`;
        }).catch(() => _fallbackCopy(finalMsg, status));
    } else _fallbackCopy(finalMsg, status);
};

window.copyEachStudentMsg = function() {
    const ta = document.getElementById('missing-msg-textarea');
    const status = document.getElementById('missing-msg-status');
    if (!ta?.value.trim()) return alert("Chưa có nội dung!");
    const data = _getMissingData();
    if (!data || !data.missing.length) return;
    const parts = data.missing.map((m, i) => `━━━ Tin ${i+1}/${data.missing.length}: ${m.name} ━━━\n${_fillTemplate(ta.value, [m])}`);
    const text = parts.join('\n\n');
    if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            status.innerHTML = `<span style="color:#166534;">Đã copy ${data.missing.length} tin!</span>`;
        }).catch(() => _fallbackCopy(text, status));
    } else _fallbackCopy(text, status);
};

function _fallbackCopy(text, statusEl) {
    const tmp = document.createElement('textarea');
    tmp.value = text;
    tmp.style.position = 'fixed';
    tmp.style.left = '-9999px';
    document.body.appendChild(tmp);
    tmp.select();
    try {
        document.execCommand('copy');
        if (statusEl) statusEl.innerHTML = '<span style="color:#166534;">Đã copy!</span>';
    } catch(e) {
        if (statusEl) statusEl.innerHTML = '<span style="color:#dc2626;">Không copy được.</span>';
        prompt("Copy thủ công:", text);
    }
    document.body.removeChild(tmp);
}

window.toggleContestManager = function() {
    const box = document.getElementById('contestManagerBox');
    const arrow = document.getElementById('contestManagerArrow');
    if (!box) return;
    if (box.style.display === 'none' || box.style.display === '') {
        box.style.display = 'block';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    } else {
        box.style.display = 'none';
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
};

/* ============ SUPER ADMIN ============ */
window.unlockSuperAdmin = function() {
    const pass = document.getElementById('superAdminPass').value;
    if (pass !== SUPER_ADMIN_PASS) return alert("Sai mật khẩu!");
    document.getElementById('superAdminLocked').style.display = 'none';
    document.getElementById('superAdminUnlocked').style.display = 'block';
    document.getElementById('sa-folder-id').value = STATE.driveConfig.folderId || '';
    document.getElementById('sa-secret-key').value = STATE.driveConfig.secretKey || '';
    document.getElementById('sa-apps-url').value = STATE.driveConfig.appsScriptUrl || '';
    // Inject ô DeepSeek key
    injectDeepSeekKeyInput();
};

window.lockSuperAdmin = function() {
    document.getElementById('superAdminLocked').style.display = 'block';
    document.getElementById('superAdminUnlocked').style.display = 'none';
    document.getElementById('superAdminPass').value = '';
    document.getElementById('superAdminBlock').classList.remove('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.saveSuperAdminConfig = function() {
    STATE.driveConfig.folderId = document.getElementById('sa-folder-id').value.trim();
    STATE.driveConfig.secretKey = document.getElementById('sa-secret-key').value.trim();
    STATE.driveConfig.appsScriptUrl = document.getElementById('sa-apps-url').value.trim();
    saveData('driveConfig', STATE.driveConfig);
    alert("Đã lưu!");
};

window.testDriveConnection = function() {
    const url = document.getElementById('sa-apps-url').value.trim();
    const result = document.getElementById('sa-test-result');
    if (!url) return result.innerHTML = '<span style="color:#fca5a5;">Chưa có URL.</span>';
    result.innerHTML = '<span style="color:#93c5fd;">Đang test...</span>';
    fetch(url, { method: 'GET', mode: 'no-cors' })
        .then(() => result.innerHTML = '<span style="color:#86efac;">OK</span>')
        .catch(err => result.innerHTML = `<span style="color:#fca5a5;">Lỗi: ${err.message}</span>`);
};

function injectDeepSeekKeyInput() {
    const box = document.getElementById('superAdminUnlocked');
    if (!box || document.getElementById('sa-deepseek-key')) return;
    const div = document.createElement('div');
    div.style.cssText = 'border-top:1px dashed #6366f1; margin-top:10px; padding-top:10px;';
    div.innerHTML = `
        <div class="form-group">
            <label style="color:#c7d2fe;">DeepSeek API Key (cho AI đọc TKB)</label>
            <input type="password" id="sa-deepseek-key" placeholder="sk-..." style="border-color:#6366f1 !important; background:#1e1b4b; color:#fff !important; width:100%; padding:8px; border-radius:6px;">
        </div>
        <div style="display:flex; gap:6px; margin-top:6px;">
            <button onclick="saveDeepseekKeyFromAdmin()" class="btn-action btn-green" style="flex:1;">Lưu key</button>
            <button onclick="clearDeepseekKey()" class="btn-action btn-red" style="flex:1;">Xóa key</button>
        </div>
        <div id="sa-key-status" style="margin-top:8px; font-size:0.8rem;"></div>
        <div style="margin-top:6px; font-size:0.72rem; color:#a5b4fc;">Key này áp dụng cho TẤT CẢ GVCN.</div>
    `;
    box.appendChild(div);
    updateSaKeyStatus();
}

window.saveDeepseekKeyFromAdmin = function() {
    const k = document.getElementById('sa-deepseek-key').value.trim();
    if (!k) return alert('Chưa nhập key!');
    if (!k.startsWith('sk-')) return alert('Key phải bắt đầu bằng "sk-"!');
    STATE.systemConfig.deepseekKey = k;
    saveData('systemConfig', STATE.systemConfig);
    updateSaKeyStatus();
    alert('Đã lưu key!');
};

window.clearDeepseekKey = function() {
    if (!confirm('Xóa API key DeepSeek?')) return;
    STATE.systemConfig.deepseekKey = '';
    saveData('systemConfig', STATE.systemConfig);
    updateSaKeyStatus();
};

function updateSaKeyStatus() {
    const el = document.getElementById('sa-key-status');
    if (!el) return;
    const k = STATE.systemConfig?.deepseekKey || '';
    el.innerHTML = k
        ? '<span style="color:#86efac; font-weight:700;">Đã có key (' + k.length + ' ký tự)</span>'
        : '<span style="color:#fca5a5; font-weight:700;">Chưa có key</span>';
}

/* ============ BANNER CLICK (3 lần mở Super Admin) ============ */
let _bannerCount = 0, _bannerTimer = null;
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.querySelector('.banner-line-1');
    if (!banner) return;
    banner.addEventListener('click', () => {
        _bannerCount++;
        clearTimeout(_bannerTimer);
        if (_bannerCount >= 3) {
            _bannerCount = 0;
            if (!window.isTeacherLoggedIn) {
                alert('Vui lòng đăng nhập GVCN trước!');
                openLoginModal();
                return;
            }
            const blk = document.getElementById('superAdminBlock');
            if (blk) {
                switchMainTab('tab3');
                setTimeout(() => {
                    document.querySelectorAll('#panel-tab3 .sidebar-item').forEach(b => {
                        b.classList.toggle('active', b.dataset.tab3 === 'q-config');
                    });
                    document.querySelectorAll('#panel-tab3 .panel').forEach(p => {
                        p.classList.toggle('active', p.id === 'q-config');
                    });
                    blk.classList.add('show');
                    setTimeout(() => blk.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
                }, 300);
            }
        }
        _bannerTimer = setTimeout(() => { _bannerCount = 0; }, 1500);
    });
});

/* ============ EVENT LISTENERS & INIT ============ */
document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Tab 1
    document.querySelectorAll('#panel-tab1 .sidebar-item[data-tab1]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#panel-tab1 .sidebar-item[data-tab1]').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('#panel-tab1 .content-panel .panel').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.dataset.tab1)?.classList.add('active');
        });
    });

    // Sidebar Tab 3
    document.querySelectorAll('#panel-tab3 .sidebar-item[data-tab3]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#panel-tab3 .sidebar-item[data-tab3]').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('#panel-tab3 .content-panel .panel').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            const target = document.getElementById(this.dataset.tab3);
            if (target) {
                target.classList.add('active');
                if (this.dataset.tab3 === 'q-hocsinh') renderAdminStudentManager();
                if (this.dataset.tab3 === 'q-sodo') renderAdminSeatingMap();
                if (this.dataset.tab3 === 'q-chucvu') renderRespRoles();
                if (this.dataset.tab3 === 'q-noiquy') renderRuleManager();
                if (this.dataset.tab3 === 'q-matkhau') renderPasswordManager();
                if (this.dataset.tab3 === 'q-lichkhoa') renderWeekDeadlinesManager();
                if (this.dataset.tab3 === 'q-tkb') renderTkbManagerUI();
                if (this.dataset.tab3 === 'q-minhchung') renderContestManagerUI();
            }
        });
    });

    // Modal login - Enter
    const inp = document.getElementById('admin-pass-input');
    if (inp) inp.addEventListener('keypress', e => { if (e.key === 'Enter') verifyTeacherPassword(); });

    // Input week select change
    const iw = document.getElementById('input-week-select');
    if (iw) iw.addEventListener('change', () => { resetInputAuth(); updateDeadlineUI(); });

    // Auto save duty
    document.addEventListener('change', e => {
        if (!e.target) return;
        if (e.target.id === 'group-pass-input' || e.target.id === 'input-week-select') return;
        const isDuty = (e.target.className && typeof e.target.className === 'string' && e.target.className.includes('duty-member-sel'))
            || (e.target.id && e.target.id.includes('duty-leader'));
        if (isDuty && typeof savedDutyData === 'function') savedDutyData(true);
    });

    // Init
    renderRulesModal();
    renderRespRoles();
    renderRuleManager();
    renderTkbManagerUI();
    renderContestManagerUI();

    // Auto select tuần thực
    setTimeout(() => {
        const cw = getCurrentRealWeek();
        if (cw <= 0) return;
        const t = "Tuần " + cw;
        ['public-duty-week-select','mobile-duty-week-select','seating-week-select','input-week-select'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = t;
        });
        renderPublicDuty();
        renderPublicDutyMobile();
        renderSeatingMap();
    }, 1000);
});

// Firebase đồng bộ TKB + SystemConfig
setTimeout(() => {
    if (!STATE.dbRef) return;
    try {
        STATE.dbRef.child('tkb').once('value').then(s => {
            if (s.exists()) {
                const d = s.val();
                if (d && d !== "null") {
                    const p = JSON.parse(d);
                    if (p && p.data) {
                        STATE.tkb = p;
                        try { localStorage.setItem('tkb', JSON.stringify(p)); } catch(e) {}
                        renderTkbPublic();
                        if (document.getElementById('tkb-manager-container')) renderTkbManagerUI();
                    }
                }
            }
        });
            // ⬇️⬇️⬇️ THÊM BLOCK NÀY ⬇️⬇️⬇️
    STATE.dbRef.child('tkbByWeek').once('value').then(s => {
        if (s.exists()) {
            const d = s.val();
            if (d && d !== "null") {
                try {
                    const p = (typeof d === 'string') ? JSON.parse(d) : d;
                    if (p && typeof p === 'object') {
                        STATE.tkbByWeek = p;
                        console.log('✅ Loaded tkbByWeek:', Object.keys(p).length, 'tuần');
                    }
                } catch(e) { console.warn('⚠️ Lỗi parse tkbByWeek:', e); }
            }
        }
        // Render lại UI (nếu Tab Lớp trưởng đang mở)
        if (document.getElementById('tkb-by-week-container')) {
            renderTkbByWeekUI();
        }
    if (document.getElementById('tkb-public-container')) {
            if (typeof renderTkbPublicView === 'function') renderTkbPublicView();
        }
    }).catch(e => console.warn('⚠️ Không load được tkbByWeek:', e));
    // ⬆️⬆️⬆️ HẾT BLOCK THÊM ⬆️⬆️⬆️
        STATE.dbRef.child('_systemConfig').once('value').then(s => {
            if (s.exists()) {
                const d = s.val();
                if (d && d !== "null") {
                    STATE.systemConfig = { ...STATE.systemConfig, ...JSON.parse(d) };
                    try { localStorage.setItem('systemConfig', JSON.stringify(STATE.systemConfig)); } catch(e) {}
                }
            }
        });
    } catch(e) {}
}, 3000);

/* ============ BẢN QUYỀN ============ */
console.log('%c⚠️ BẢN QUYỀN THUỘC: Cô Trịnh Ngọc Ánh', 'color:#dc2626; font-size:20px; font-weight:bold;');
console.log('%cZalo: 0768269194', 'color:#0068ff; font-size:16px; font-weight:bold;');
console.log('%cMọi hành vi sao chép/bán lại là vi phạm bản quyền!', 'color:#dc2626; font-size:14px;');
console.log('%c[OK] TOÀN BỘ HỆ THỐNG ĐÃ SẴN SÀNG (Phần 4/4)', 'color:#16a34a; font-weight:bold; font-size:16px;');
/* ============================================================
   PATCH: FIX LỖI HIỂN THỊ MODAL + GỌN LAYOUT TRA CỨU THI ĐUA
============================================================ */
(function(){
    'use strict';

    // ===== 1. FIX CSS MODAL: bỏ min-width 700px của table =====
    const st = document.createElement('style');
    st.textContent = `
        /* Bảng trong modal sao kê: không dùng min-width global */
        #detail-modal-content table,
        #detail-modal-content .score-detail-table {
            min-width: 0 !important;
            width: 100% !important;
        }
        #detail-modal-content .score-detail-table td,
        #detail-modal-content .score-detail-table th {
            padding: 8px 10px !important;
        }
        #detail-modal-content .score-detail-table td:first-child,
        #detail-modal-content .score-detail-table th:first-child {
            width: auto !important;
            min-width: 120px;
            text-align: left;
        }
        #detail-modal-content .score-detail-table td:last-child,
        #detail-modal-content .score-detail-table th:last-child {
            width: 85px !important;
            min-width: 85px;
        }
        /* Header modal: chống tràn tên dài */
        #detail-modal-content .score-detail-header {
            flex-wrap: wrap;
        }
        #detail-modal-content .score-detail-header .name {
            word-break: break-word;
            overflow-wrap: anywhere;
            flex: 1 1 100%;
            margin-bottom: 4px;
        }
    `;
    document.head.appendChild(st);

    // ===== 2. GỌN LAYOUT: ẩn bảng thống kê lặp khi đã tra cứu cá nhân =====
    // Bảng "Điểm cộng/Lỗi vi phạm tuần" của CẢ LỚP vẫn cần thiết, 
    // nhưng cần phân tách rõ ràng để không nhầm với hồ sơ cá nhân.
    
    const origRender = window.renderPublicSummaryTable;
    window.renderPublicSummaryTable = function() {
        if (typeof origRender === 'function') origRender.apply(this, arguments);
        setTimeout(() => {
            // Đổi tiêu đề bảng thống kê cả lớp để phân biệt với hồ sơ cá nhân
            const box = document.getElementById('custom-summary-error-box');
            if (!box) return;
            const titleEls = box.querySelectorAll('div[style*="font-weight:bold"]');
            titleEls.forEach(el => {
                const t = el.textContent;
                if (t.includes('Điểm cộng') && !t.includes('CẢ LỚP')) {
                    el.innerHTML = el.innerHTML
                        .replace('Điểm cộng', 'CẢ LỚP — Điểm cộng')
                        .replace('Lỗi vi phạm', 'CẢ LỚP — Lỗi vi phạm');
                }
            });
        }, 150);
    };

    // ===== 3. Khi tra cứu cá nhân: ẩn bảng thống kê cả lớp =====
    const origView = window.viewStudentDetails;
    window.viewStudentDetails = function() {
        if (typeof origView === 'function') origView.apply(this, arguments);
        const reportDiv = document.getElementById('student-detail-report');
        if (reportDiv && reportDiv.style.display !== 'none' && reportDiv.innerHTML.trim()) {
            // Đã tra cứu thành công → ẩn bảng thống kê cả lớp
            const box = document.getElementById('custom-summary-error-box');
            if (box) box.style.display = 'none';
        }
    };

    const origViewM = window.viewStudentDetailsMobile;
    window.viewStudentDetailsMobile = function() {
        if (typeof origViewM === 'function') origViewM.apply(this, arguments);
        const reportDiv = document.getElementById('mobile-student-detail-report');
        if (reportDiv && reportDiv.style.display !== 'none' && reportDiv.innerHTML.trim()) {
            const box = document.getElementById('custom-summary-error-box');
            if (box) box.style.display = 'none';
        }
    };

    // ===== 4. Cải tiến layout: nút "Đóng kết quả tra cứu" để ẩn hồ sơ cá nhân =====
    // Sau khi đóng, hiển thị lại bảng thống kê cả lớp
    window.closeStudentReport = function() {
        const reportDiv = document.getElementById('student-detail-report');
        const reportDivMobile = document.getElementById('mobile-student-detail-report');
        const box = document.getElementById('custom-summary-error-box');
        if (reportDiv) {
            reportDiv.innerHTML = '';
            reportDiv.style.display = 'none';
        }
        if (reportDivMobile) {
            reportDivMobile.innerHTML = '';
            reportDivMobile.style.display = 'none';
        }
        if (box) box.style.display = '';
    };

    // Hook nút Đóng vào kết quả tra cứu — tự thêm sau khi render
    const addCloseBtn = () => {
        const reportDiv = document.getElementById('student-detail-report');
        if (reportDiv && reportDiv.style.display !== 'none' && reportDiv.innerHTML.trim()) {
            if (!reportDiv.querySelector('.btn-close-report')) {
                const btn = document.createElement('button');
                btn.className = 'btn-close-report btn-action btn-gray';
                btn.style.cssText = 'margin-top:10px; font-size:0.8rem; padding:8px 14px;';
                btn.textContent = 'Đóng kết quả tra cứu';
                btn.onclick = window.closeStudentReport;
                reportDiv.appendChild(btn);
            }
        }
    };

    const origView2 = window.viewStudentDetails;
    window.viewStudentDetails = function() {
        if (typeof origView2 === 'function') origView2.apply(this, arguments);
        setTimeout(addCloseBtn, 200);
    };

    console.log('[OK] PATCH FIX MODAL + GỌN LAYOUT TRA CỨU — ĐÃ ÁP DỤNG');
})();
/* ============================================================
   PATCH A: FIX CSS BẢNG THỐNG KÊ (không tràn khung)
============================================================ */
(function(){
    'use strict';
    const st = document.createElement('style');
    st.textContent = `
        /* Reset mọi min-width cho bảng stats-grid và modal */
        #custom-summary-error-box table,
        #custom-summary-error-box .stats-grid table,
        #detail-modal-content table,
        #student-detail-report table,
        #mobile-student-detail-report table {
            min-width: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            table-layout: fixed !important;
        }
        
        #custom-summary-error-box table td,
        #custom-summary-error-box table th,
        #detail-modal-content table td,
        #detail-modal-content table th {
            word-break: break-word !important;
            overflow-wrap: anywhere !important;
            white-space: normal !important;
            padding: 8px 6px !important;
            font-size: 0.78rem !important;
            vertical-align: middle !important;
        }

        /* Cột đầu tiên (Học sinh) co giãn */
        #custom-summary-error-box table td:first-child,
        #custom-summary-error-box table th:first-child {
            width: auto !important;
            text-align: left !important;
        }

        /* Cột số (Lượt/Số lỗi) cố định 60px */
        #custom-summary-error-box table td:last-child,
        #custom-summary-error-box table th:last-child {
            width: 60px !important;
            min-width: 60px !important;
            max-width: 60px !important;
            text-align: center !important;
        }

        /* Grid 2 cột đều nhau */
        #custom-summary-error-box .stats-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
            width: 100% !important;
        }

        /* Mobile: xếp dọc */
        @media (max-width: 700px) {
            #custom-summary-error-box .stats-grid {
                grid-template-columns: 1fr !important;
            }
        }

        /* Ô chứa bảng không tràn */
        #custom-summary-error-box .stats-grid > div {
            min-width: 0 !important;
            overflow: hidden !important;
        }
    `;
    document.head.appendChild(st);
    console.log('[OK] PATCH A: CSS STATS-GRID — ĐÃ ÁP DỤNG');
})();
  
/* ============================================================
   PATCH GỘP: TÁI CẤU TRÚC TAB 1 + HIGHLIGHT NỘP MINH CHỨNG
   - Tách "Tra cứu thi đua" → "Tra cứu cá nhân" + "Tra cứu lớp"
   - Thêm "Nộp minh chứng" (tự ẩn/hiện khi có cuộc thi, có hiệu ứng nổi bật)
============================================================ */
(function(){
    'use strict';

    /* ============ CSS ============ */
    const style = document.createElement('style');
    style.textContent = `
        /* Sidebar "Nộp minh chứng" nổi bật */
        .sidebar-item.sidebar-highlight {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border: 1.5px solid #f59e0b;
            color: #78350f !important;
            position: relative;
            animation: sidebar-pulse 2s ease-in-out infinite;
            font-weight: 800;
        }
        .sidebar-item.sidebar-highlight .ind {
            background: #dc2626 !important;
            box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
        }
        .sidebar-item.sidebar-highlight:hover {
            background: linear-gradient(135deg, #fde68a, #fcd34d);
        }
        .sidebar-item.sidebar-highlight.active {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: #fff !important;
        }
        .sidebar-item.sidebar-highlight.active .ind { background: #fde047 !important; }
        @keyframes sidebar-pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.5); }
            50% { transform: scale(1.02); box-shadow: 0 0 0 6px rgba(245, 158, 11, 0); }
        }
        .sidebar-item.sidebar-highlight::after {
            content: 'MỚI';
            position: absolute;
            top: 50%;
            right: 8px;
            transform: translateY(-50%);
            background: #dc2626;
            color: #fff;
            font-size: 0.6rem;
            font-weight: 800;
            padding: 2px 6px;
            border-radius: 8px;
            animation: badge-blink 1s ease-in-out infinite;
        }
        .sidebar-item.sidebar-highlight.active::after { display: none; }
        @keyframes badge-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }

        /* Mobile accordion nổi bật */
        .acc-item.acc-highlight {
            border: 2px solid #f59e0b !important;
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
            animation: acc-pulse 2s ease-in-out infinite;
        }
        .acc-item.acc-highlight .acc-header {
            background: linear-gradient(135deg, #fef3c7, #fde68a) !important;
            color: #78350f !important;
            font-weight: 900;
            position: relative;
        }
        .acc-item.acc-highlight .acc-header::after {
            content: 'MỚI';
            position: absolute;
            top: 50%;
            right: 40px;
            transform: translateY(-50%);
            background: #dc2626;
            color: #fff;
            font-size: 0.6rem;
            font-weight: 800;
            padding: 2px 6px;
            border-radius: 8px;
            animation: badge-blink 1s ease-in-out infinite;
        }
        .acc-item.acc-highlight.open .acc-header {
            background: linear-gradient(135deg, #f59e0b, #d97706) !important;
            color: #fff !important;
        }
        .acc-item.acc-highlight.open .acc-header::after { display: none; }
        @keyframes acc-pulse {
            0%, 100% { box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15); }
            50% { box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
        }
    `;
    document.head.appendChild(style);

    /* ============ TÁI CẤU TRÚC TAB 1 ============ */
    let _reorgLock = false;

    function reorganizeTab1() {
        if (_reorgLock) return;
        _reorgLock = true;

        const panelTab1 = document.getElementById('panel-tab1');
        if (!panelTab1) { _reorgLock = false; return; }

        // --- Sidebar desktop ---
        const sidebar = panelTab1.querySelector('.sidebar');
        if (sidebar && !sidebar.dataset.reorganized) {
            const oldTracuu = sidebar.querySelector('.sidebar-item[data-tab1="p-tracuu"]');

            if (oldTracuu) {
                oldTracuu.dataset.tab1 = 'p-tracuu-cn';
                oldTracuu.innerHTML = '<span class="ind"></span> Tra cứu cá nhân';
            }

            const minhchungBtn = document.createElement('button');
            minhchungBtn.className = 'sidebar-item';
            minhchungBtn.dataset.tab1 = 'p-minhchung';
            minhchungBtn.id = 'sidebar-minhchung';
            minhchungBtn.style.display = 'none';
            minhchungBtn.innerHTML = '<span class="ind"></span> Nộp minh chứng';

            const tracuuLopBtn = document.createElement('button');
            tracuuLopBtn.className = 'sidebar-item';
            tracuuLopBtn.dataset.tab1 = 'p-tracuu-lop';
            tracuuLopBtn.innerHTML = '<span class="ind"></span> Tra cứu lớp';

            if (oldTracuu) {
                oldTracuu.parentElement.insertBefore(minhchungBtn, oldTracuu.nextSibling);
                oldTracuu.parentElement.insertBefore(tracuuLopBtn, minhchungBtn.nextSibling);
            }

            sidebar.dataset.reorganized = '1';
        }

        // --- Panel content ---
        const contentPanel = panelTab1.querySelector('.content-panel');
        if (contentPanel && !contentPanel.dataset.reorganized) {
            const oldPanel = document.getElementById('p-tracuu');

            if (oldPanel) {
                oldPanel.id = 'p-tracuu-cn';

                const statsBox = oldPanel.querySelector('#custom-summary-error-box');
                const rankingCard = oldPanel.querySelector('.card.blue');
                const footerNote = oldPanel.querySelector('div[style*="font-style:italic"]');

                const tracuuLopPanel = document.createElement('div');
                tracuuLopPanel.className = 'panel';
                tracuuLopPanel.id = 'p-tracuu-lop';
                tracuuLopPanel.innerHTML = '<h2>Tra cứu lớp</h2>';
                if (statsBox) tracuuLopPanel.appendChild(statsBox);
                if (rankingCard) tracuuLopPanel.appendChild(rankingCard);
                if (footerNote) tracuuLopPanel.appendChild(footerNote);

                oldPanel.parentElement.insertBefore(tracuuLopPanel, oldPanel.nextSibling);

                const minhchungPanel = document.createElement('div');
                minhchungPanel.className = 'panel';
                minhchungPanel.id = 'p-minhchung';
                minhchungPanel.innerHTML = '<h2>Nộp minh chứng</h2><div id="photo-contest-section-moved"></div>';

                const photoSection = document.getElementById('photo-contest-section');
                if (photoSection) {
                    photoSection.id = 'photo-contest-section-old';
                    photoSection.style.display = 'none';

                    const movedSection = document.createElement('div');
                    movedSection.id = 'photo-contest-section';
                    movedSection.style.display = 'none';
                    movedSection.style.marginBottom = '14px';
                    minhchungPanel.querySelector('#photo-contest-section-moved').appendChild(movedSection);
                }

                oldPanel.parentElement.insertBefore(minhchungPanel, tracuuLopPanel.nextSibling);
                contentPanel.dataset.reorganized = '1';
            }
        }

        // --- Mobile accordion ---
        const mobileAcc = panelTab1.querySelector('.mobile-acc');
        if (mobileAcc && !mobileAcc.dataset.reorganized) {
            const allAccItems = mobileAcc.querySelectorAll('.acc-item');
            let tracuuAccItem = null;

            allAccItems.forEach(item => {
                const header = item.querySelector('.acc-header');
                if (header && header.textContent.includes('TRA CỨU THI ĐUA')) {
                    tracuuAccItem = item;
                    header.innerHTML = 'TRA CỨU CÁ NHÂN <span class="arrow">▼</span>';
                }
            });

            if (tracuuAccItem) {
                const minhchungAcc = document.createElement('div');
                minhchungAcc.className = 'acc-item';
                minhchungAcc.id = 'mobile-acc-minhchung';
                minhchungAcc.style.display = 'none';
                minhchungAcc.innerHTML = `
                    <button class="acc-header" onclick="toggleAcc(this)">NỘP MINH CHỨNG <span class="arrow">▼</span></button>
                    <div class="acc-body" id="mobile-photo-contest-section-2"></div>
                `;

                const tracuuLopAcc = document.createElement('div');
                tracuuLopAcc.className = 'acc-item';
                tracuuLopAcc.innerHTML = `
                    <button class="acc-header" onclick="toggleAcc(this)">TRA CỨU LỚP <span class="arrow">▼</span></button>
                    <div class="acc-body">
                        <div style="font-size:0.82rem; color:#64748b; margin-bottom:10px;">Xem bảng thống kê và xếp hạng cả lớp</div>
                        <button class="btn-action btn-primary" style="width:100%;" onclick="openMobileTracuuLop()">Mở bảng xếp hạng lớp</button>
                    </div>
                `;

                tracuuAccItem.parentElement.insertBefore(minhchungAcc, tracuuAccItem.nextSibling);
                tracuuAccItem.parentElement.insertBefore(tracuuLopAcc, minhchungAcc.nextSibling);
            }
            mobileAcc.dataset.reorganized = '1';
        }

        _reorgLock = false;
    }

    window.openMobileTracuuLop = function() {
        document.querySelectorAll('#panel-tab1 .sidebar-item').forEach(b => {
            b.classList.toggle('active', b.dataset.tab1 === 'p-tracuu-lop');
        });
        document.querySelectorAll('#panel-tab1 .panel').forEach(p => {
            p.classList.toggle('active', p.id === 'p-tracuu-lop');
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /* ============ ẨN/HIỆN + HIGHLIGHT "NỘP MINH CHỨNG" ============ */
    function updateMinhChungVisibility() {
        const now = new Date();
        const activeContests = Object.entries(STATE.photoContests || {})
            .filter(([_, c]) => c.active && new Date(c.deadline) > now);
        const hasContest = activeContests.length > 0;

        // Sidebar desktop
        const sidebarBtn = document.getElementById('sidebar-minhchung');
        if (sidebarBtn) {
            sidebarBtn.style.display = hasContest ? 'flex' : 'none';
            sidebarBtn.classList.toggle('sidebar-highlight', hasContest);
            if (!hasContest && sidebarBtn.classList.contains('active')) {
                const tbBtn = document.querySelector('#panel-tab1 .sidebar-item[data-tab1="p-thongbao"]');
                if (tbBtn) tbBtn.click();
            }
        }

        // Mobile accordion
        const mobileAcc = document.getElementById('mobile-acc-minhchung');
        if (mobileAcc) {
            mobileAcc.style.display = hasContest ? 'block' : 'none';
            mobileAcc.classList.toggle('acc-highlight', hasContest);
            if (!hasContest && mobileAcc.classList.contains('open')) {
                mobileAcc.classList.remove('open');
            }
        }
    }
    window.updateMinhChungVisibility = updateMinhChungVisibility;

    // Hook photo render
    const _origPhoto = window.renderPublicPhotoSection;
    window.renderPublicPhotoSection = function() {
        if (typeof _origPhoto === 'function') _origPhoto.apply(this, arguments);
        setTimeout(() => {
            const oldSection = document.getElementById('photo-contest-section-old');
            if (oldSection) oldSection.style.display = 'none';
            updateMinhChungVisibility();
        }, 100);
    };

    /* ============ BIND SIDEBAR EVENTS ============ */
    function bindSidebarEvents() {
        const panelTab1 = document.getElementById('panel-tab1');
        if (!panelTab1) return;
        panelTab1.querySelectorAll('.sidebar-item[data-tab1]').forEach(btn => {
            if (btn.dataset.bound) return;
            btn.dataset.bound = '1';
            btn.addEventListener('click', function() {
                panelTab1.querySelectorAll('.sidebar-item[data-tab1]').forEach(b => b.classList.remove('active'));
                panelTab1.querySelectorAll('.content-panel .panel').forEach(p => p.classList.remove('active'));
                this.classList.add('active');
                const target = document.getElementById(this.dataset.tab1);
                if (target) target.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    /* ============ HOOK + KHỞI ĐỘNG ============ */
    const _origSwitch = window.switchMainTab;
    window.switchMainTab = function(tabId) {
        if (typeof _origSwitch === 'function') _origSwitch.apply(this, arguments);
        if (tabId === 'tab1') {
            setTimeout(() => {
                reorganizeTab1();
                updateMinhChungVisibility();
                bindSidebarEvents();
            }, 300);
        }
    };

    function runAll() {
        reorganizeTab1();
        updateMinhChungVisibility();
        bindSidebarEvents();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(runAll, 2000));
    } else {
        setTimeout(runAll, 2000);
    }

    setInterval(() => {
        reorganizeTab1();
        updateMinhChungVisibility();
    }, 3000);

    console.log('[OK] PATCH GỘP: TÁI CẤU TRÚC TAB 1 + HIGHLIGHT — ĐÃ ÁP DỤNG');
})();

/* ============================================================
   PATCH GỘP CUỐI: BỎ THÔNG BÁO + THÊM NỘI QUY LỚP CHI TIẾT
============================================================ */
(function(){
    'use strict';

    /* ============ CSS ============ */
    const style = document.createElement('style');
    style.textContent = `
        .rule-section { margin-bottom: 18px; }
        .rule-section-title {
            background: linear-gradient(135deg, #1e40af, #2563eb);
            color: #fff; padding: 10px 14px; border-radius: 10px;
            font-weight: 800; font-size: 0.95rem; margin-bottom: 10px;
        }
        .rule-group { border: 1.5px solid; border-radius: 10px; overflow: hidden; margin-bottom: 10px; background: #fff; }
        .rule-group-header {
            padding: 8px 12px; font-weight: 800; font-size: 0.85rem;
            color: #fff; display: flex; justify-content: space-between; align-items: center;
        }
        .rule-group-header .count {
            background: rgba(255,255,255,0.25); padding: 2px 10px;
            border-radius: 12px; font-size: 0.72rem;
        }
        .rule-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; table-layout: fixed; }
        .rule-table th {
            background: #f8fafc; padding: 8px 10px; text-align: left;
            font-weight: 800; color: #334155; border-bottom: 1px solid #e2e8f0; font-size: 0.78rem;
        }
        .rule-table td {
            padding: 8px 10px; border-bottom: 1px solid #f1f5f9;
            vertical-align: middle; word-wrap: break-word;
        }
        .rule-table tr:last-child td { border-bottom: none; }
        .rule-table .stt { width: 36px; text-align: center; color: #64748b; font-weight: 700; }
        .rule-table .points { width: 75px; text-align: center; font-weight: 800; }
        .rule-table .points.minus { color: #dc2626; }
        .rule-table .points.plus { color: #16a34a; }
        .rule-table .note { color: #64748b; font-size: 0.75rem; font-style: italic; }
        .grade-block { background: #fff; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 12px 14px; margin-bottom: 10px; }
        .grade-block h4 {
            color: #1e40af; font-size: 0.9rem; margin-bottom: 10px;
            padding-bottom: 6px; border-bottom: 1.5px dashed #e2e8f0;
        }
        .grade-list { list-style: none; padding: 0; margin: 0; }
        .grade-list li {
            padding: 8px 0; border-bottom: 1px solid #f1f5f9;
            font-size: 0.83rem; line-height: 1.5;
        }
        .grade-list li:last-child { border-bottom: none; }
        .grade-badge {
            display: inline-block; padding: 2px 10px; border-radius: 6px;
            font-weight: 800; font-size: 0.78rem; margin-right: 8px;
            min-width: 75px; text-align: center;
        }
        .grade-badge.tot { background: #dcfce7; color: #166534; }
        .grade-badge.kha { background: #fef3c7; color: #92400e; }
        .grade-badge.dat { background: #dbeafe; color: #1e40af; }
        .grade-badge.cd  { background: #fee2e2; color: #991b1b; }
        .warn-box {
            background: #fffbeb; border: 1.5px solid #fcd34d;
            border-radius: 10px; padding: 12px 14px; margin-bottom: 14px;
            font-size: 0.83rem; line-height: 1.55; color: #78350f;
        }
        .warn-box strong { color: #92400e; }
        .info-box {
            background: linear-gradient(135deg, #eff6ff, #dbeafe);
            border: 1.5px solid #3b82f6; border-radius: 10px;
            padding: 12px 14px; margin-bottom: 14px;
            font-size: 0.83rem; line-height: 1.55; color: #1e3a8a;
        }
        @media (max-width: 700px) {
            .rule-table { font-size: 0.78rem; }
            .rule-table th, .rule-table td { padding: 6px 8px; }
            .rule-table .stt { width: 28px; }
            .rule-table .points { width: 60px; font-size: 0.75rem; }
            .rule-table .note { display: none; }
            .grade-badge { min-width: 60px; font-size: 0.72rem; padding: 2px 6px; }
        }
    `;
    document.head.appendChild(style);

    /* ============ 1. TÁI CẤU TRÚC SIDEBAR ============ */
    function restructureSidebar() {
        const panelTab1 = document.getElementById('panel-tab1');
        if (!panelTab1) return;

        const sidebar = panelTab1.querySelector('.sidebar');
        if (!sidebar) return;

        // 1.1. Xóa "Thông báo"
        const oldTB = sidebar.querySelector('.sidebar-item[data-tab1="p-thongbao"]');
        if (oldTB) oldTB.remove();

        // 1.2. Đổi "Tra cứu thi đua" → "Tra cứu cá nhân" (nếu chưa)
        const oldTracuu = sidebar.querySelector('.sidebar-item[data-tab1="p-tracuu"]');
        if (oldTracuu) {
            oldTracuu.dataset.tab1 = 'p-tracuu-cn';
            oldTracuu.innerHTML = '<span class="ind"></span> Tra cứu cá nhân';
        }

        // 1.3. Thêm "Nộp minh chứng" + "Tra cứu lớp" (nếu chưa)
        if (!document.getElementById('sidebar-minhchung')) {
            const refBtn = sidebar.querySelector('.sidebar-item[data-tab1="p-tracuu-cn"]')
                        || sidebar.querySelector('.sidebar-item[data-tab1="p-tracuu"]');
            if (refBtn) {
                const mc = document.createElement('button');
                mc.className = 'sidebar-item';
                mc.dataset.tab1 = 'p-minhchung';
                mc.id = 'sidebar-minhchung';
                mc.style.display = 'none';
                mc.innerHTML = '<span class="ind"></span> Nộp minh chứng';
                refBtn.parentElement.insertBefore(mc, refBtn.nextSibling);

                const tl = document.createElement('button');
                tl.className = 'sidebar-item';
                tl.dataset.tab1 = 'p-tracuu-lop';
                tl.innerHTML = '<span class="ind"></span> Tra cứu lớp';
                refBtn.parentElement.insertBefore(tl, mc.nextSibling);
            }
        }

        // 1.4. Thêm "Nội quy lớp" ở cuối (nếu chưa)
        if (!document.getElementById('sidebar-noiquy')) {
            const nq = document.createElement('button');
            nq.className = 'sidebar-item';
            nq.dataset.tab1 = 'p-noiquy';
            nq.id = 'sidebar-noiquy';
            nq.style.cssText = 'margin-top:10px; border-top:1.5px dashed #cbd5e1; padding-top:14px;';
            nq.innerHTML = '<span class="ind"></span> Nội quy lớp';
            sidebar.appendChild(nq);

            // Bind event
            nq.addEventListener('click', function() {
                panelTab1.querySelectorAll('.sidebar-item[data-tab1]').forEach(b => b.classList.remove('active'));
                panelTab1.querySelectorAll('.content-panel .panel').forEach(p => p.classList.remove('active'));
                this.classList.add('active');
                document.getElementById('p-noiquy')?.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    /* ============ 2. TÁI CẤU TRÚC PANEL CONTENT ============ */
    function restructurePanels() {
        const panelTab1 = document.getElementById('panel-tab1');
        if (!panelTab1) return;
        const contentPanel = panelTab1.querySelector('.content-panel');
        if (!contentPanel) return;

        // 2.1. Ẩn panel "Thông báo" cũ
        const oldTBPanel = document.getElementById('p-thongbao');
        if (oldTBPanel) oldTBPanel.style.display = 'none';

        // 2.2. Đổi p-tracuu → p-tracuu-cn + tạo panel mới
        const oldTracuu = document.getElementById('p-tracuu');
        if (oldTracuu) {
            oldTracuu.id = 'p-tracuu-cn';

            // Panel "Tra cứu lớp"
            if (!document.getElementById('p-tracuu-lop')) {
                const statsBox = oldTracuu.querySelector('#custom-summary-error-box');
                const rankingCard = oldTracuu.querySelector('.card.blue');
                const footerNote = oldTracuu.querySelector('div[style*="font-style:italic"]');

                const tlp = document.createElement('div');
                tlp.className = 'panel';
                tlp.id = 'p-tracuu-lop';
                tlp.innerHTML = '<h2>Tra cứu lớp</h2>';
                if (statsBox) tlp.appendChild(statsBox);
                if (rankingCard) tlp.appendChild(rankingCard);
                if (footerNote) tlp.appendChild(footerNote);
                oldTracuu.parentElement.insertBefore(tlp, oldTracuu.nextSibling);
            }

            // Panel "Nộp minh chứng"
            if (!document.getElementById('p-minhchung')) {
                const mcp = document.createElement('div');
                mcp.className = 'panel';
                mcp.id = 'p-minhchung';
                mcp.innerHTML = '<h2>Nộp minh chứng</h2><div id="photo-contest-section-moved"></div>';

                const oldPhoto = document.getElementById('photo-contest-section');
                if (oldPhoto) {
                    oldPhoto.id = 'photo-contest-section-old';
                    oldPhoto.style.display = 'none';
                    const moved = document.createElement('div');
                    moved.id = 'photo-contest-section';
                    moved.style.display = 'none';
                    moved.style.marginBottom = '14px';
                    mcp.querySelector('#photo-contest-section-moved').appendChild(moved);
                }
                oldTracuu.parentElement.insertBefore(mcp, document.getElementById('p-tracuu-lop')?.nextSibling || oldTracuu.nextSibling);
            }
        }

        // 2.3. Panel "Nội quy lớp"
        if (!document.getElementById('p-noiquy')) {
            const nqp = document.createElement('div');
            nqp.className = 'panel';
            nqp.id = 'p-noiquy';
            nqp.innerHTML = '<h2>Nội quy lớp</h2><div id="noiquy-content"></div>';
            contentPanel.appendChild(nqp);
        }
    }

    /* ============ 3. RENDER NỘI QUY CHI TIẾT ============ */
    function renderDetailedRules() {
        const container = document.getElementById('noiquy-content');
        if (!container) return;
        if (container.dataset.rendered === '1' && container.dataset.sig === ERROR_TYPES.length + '_' + ERROR_TYPES.map(r => r.key).join(',')) return;

        const groups = {};
        ERROR_TYPES.forEach(r => {
            const g = r.group ?? 0;
            if (!groups[g]) groups[g] = [];
            groups[g].push(r);
        });

        let html = '';
        html += `<div class="info-box">
            <strong>Quy định chung:</strong> Mỗi học sinh có <strong>100 điểm/tuần</strong>. Cộng/trừ theo các mục nội quy bên dưới.
            Cuối tuần, tổ trưởng tổng hợp và nộp báo cáo.<br>
            <strong>Lưu ý:</strong> Vi phạm từ lần thứ 2 trở đi, điểm trừ sẽ <strong>gấp đôi</strong> lần trước đó.
        </div>`;

        // A. Lỗi vi phạm
        html += '<div class="rule-section">';
        html += '<div class="rule-section-title">A. CÁC LỖI VI PHẠM (ĐIỂM TRỪ)</div>';
        [1, 2, 3, 4, 5, 0].forEach(gNum => {
            const gr = RULE_GROUPS[gNum];
            const items = groups[gNum];
            if (!items || !items.length) return;

            html += `<div class="rule-group" style="border-color:${gr.color};">`;
            html += `<div class="rule-group-header" style="background:${gr.color};">
                <span>${gr.name}</span><span class="count">${items.length} mục</span>
            </div>`;
            html += '<table class="rule-table"><thead><tr><th class="stt">#</th><th>Lỗi vi phạm</th><th class="points">Trừ</th><th class="note">Ghi chú</th></tr></thead><tbody>';

            items.forEach((r, idx) => {
                let pt = '?', cls = 'minus';
                if (typeof r.pen === 'number') {
                    if (r.pen < 0) { pt = '+' + Math.abs(r.pen) + 'đ'; cls = 'plus'; }
                    else pt = '-' + r.pen + 'đ';
                } else if (r.pen === 'custom_sub') pt = 'Tùy ý';
                else if (r.pen === 'custom_add') { pt = 'Tùy ý'; cls = 'plus'; }

                let note = '';
                if (r.label.includes('Nghỉ có phép')) note = 'Cần xác nhận GVCN';
                else if (r.label.includes('Nghỉ không phép')) note = 'Không lý do';
                else if (r.label.includes('Đi muộn < 3')) note = 'Sau chuông báo';
                else if (r.label.includes('Đi muộn 3')) note = '3-5 phút';
                else if (r.label.includes('Đi muộn > 5')) note = 'Trên 5 phút';
                else if (r.label.includes('điện thoại')) note = 'Thu máy 2 tháng';
                else if (r.label.includes('HTNV')) note = 'GVCN quyết định';
                else if (r.label.includes('MBH')) note = 'An toàn giao thông';
                else if (r.label.includes('cờ đỏ')) note = 'Số điểm lớp × 2';
                else if (r.pen === 'custom_sub') note = 'GVCN tự đánh giá';

                html += `<tr><td class="stt">${idx+1}</td><td>${r.label}</td>
                    <td class="points ${cls}">${pt}</td><td class="note">${note}</td></tr>`;
            });
            html += '</tbody></table></div>';
        });
        html += '</div>';

        // B. Điểm cộng
        html += '<div class="rule-section">';
        html += '<div class="rule-section-title" style="background:linear-gradient(135deg,#16a34a,#059669);">B. ĐIỂM CỘNG & KHEN THƯỞNG</div>';
        const bonus = groups[11] || [];
        if (bonus.length) {
            html += '<div class="rule-group" style="border-color:#16a34a;">';
            html += `<div class="rule-group-header" style="background:#16a34a;"><span>ĐIỂM CỘNG</span><span class="count">${bonus.length} mục</span></div>`;
            html += '<table class="rule-table"><thead><tr><th class="stt">#</th><th>Nội dung</th><th class="points">Cộng</th><th class="note">Ghi chú</th></tr></thead><tbody>';
            bonus.forEach((r, idx) => {
                let pt = '+?';
                if (typeof r.pen === 'number' && r.pen < 0) pt = '+' + Math.abs(r.pen) + 'đ';
                else if (r.pen === 'custom_add') pt = 'Tùy ý';
                let note = '';
                if (r.label.includes('Điểm ≥9 (thường xuyên)')) note = 'Mỗi điểm đạt';
                else if (r.label.includes('Điểm ≥9 (định kỳ)')) note = 'Mỗi điểm đạt';
                else if (r.label.includes('Điểm ≥8')) note = 'Mỗi điểm đạt';
                else if (r.label.includes('Phát biểu')) note = 'Mỗi lần phát biểu';
                else if (r.label.includes('Thuyết trình')) note = 'Mỗi lần thuyết trình';
                else if (r.label.includes('HĐ lớp')) note = 'Mỗi lần tham gia';
                else if (r.label.includes('HĐ trường')) note = 'Mỗi lần tham gia';
                else if (r.pen === 'custom_add') note = 'GVCN tự đánh giá';
                html += `<tr><td class="stt">${idx+1}</td><td>${r.label}</td>
                    <td class="points plus">${pt}</td><td class="note">${note}</td></tr>`;
            });
            html += '</tbody></table></div>';
        }
        html += '</div>';

        // C. Xếp loại
        html += '<div class="rule-section">';
        html += '<div class="rule-section-title" style="background:linear-gradient(135deg,#7c3aed,#6d28d9);">C. QUY ĐỊNH XẾP LOẠI</div>';

        // Tháng
        html += `<div class="grade-block">
            <h4>1. XẾP LOẠI THÁNG</h4>
            <p style="font-size:0.82rem; color:#64748b; margin-bottom:10px;">Phải thỏa mãn <b>ĐỒNG THỜI</b> cả 2 điều kiện: Điểm TB và Điểm khống chế từng tuần</p>
            <ul class="grade-list">
                <li><span class="grade-badge tot">TỐT</span> Điểm TB <strong>≥ 90đ</strong> (không tuần nào &lt; 80đ)</li>
                <li><span class="grade-badge kha">KHÁ</span> Điểm TB <strong>80 – &lt;90đ</strong> (không tuần nào &lt; 65đ)</li>
                <li><span class="grade-badge dat">ĐẠT</span> Điểm TB <strong>50 – &lt;80đ</strong></li>
                <li><span class="grade-badge cd">CHƯA ĐẠT</span> Điểm TB <strong>&lt; 50đ</strong> hoặc vi phạm nặng</li>
            </ul>
            <div style="background:#f0f9ff; padding:10px; border-radius:8px; margin-top:10px; font-size:0.8rem; line-height:1.6; color:#1e40af;">
                <b>Ví dụ:</b><br>
                • Điểm [95, 100, 90, 95] → TB 95, min 90 → <b style="color:#16a34a;">TỐT</b><br>
                • Điểm [100, 100, 75, 100] → TB 93.8, min 75 → <b style="color:#d97706;">KHÁ</b> (tuần 3 &lt; 80)
            </div>
        </div>`;

        // Học kỳ
        html += `<div class="grade-block">
            <h4>2. XẾP LOẠI HỌC KỲ</h4>
            <ul class="grade-list">
                <li><span class="grade-badge tot">TỐT</span> Ít nhất <strong>3 tháng TỐT</strong>, tháng còn lại không dưới KHÁ</li>
                <li><span class="grade-badge kha">KHÁ</span> Ít nhất <strong>3 tháng KHÁ trở lên</strong>, tháng còn lại không dưới ĐẠT</li>
                <li><span class="grade-badge dat">ĐẠT</span> Ít nhất <strong>3 tháng ĐẠT trở lên</strong>, không có tháng CHƯA ĐẠT</li>
                <li><span class="grade-badge cd">CHƯA ĐẠT</span> Còn lại hoặc bị Hội đồng kỷ luật</li>
            </ul>
        </div>`;

        // Cả năm
        html += `<div class="grade-block">
            <h4>3. XẾP LOẠI CẢ NĂM</h4>
            <ul class="grade-list">
                <li><span class="grade-badge tot">TỐT</span> 2 HK đều TỐT, <strong>hoặc</strong> HK1 Khá + HK2 TỐT</li>
                <li><span class="grade-badge kha">KHÁ</span> 2 HK từ KHÁ lên, <strong>hoặc</strong> HK1 TỐT + HK2 KHÁ, <strong>hoặc</strong> HK1 ĐẠT + HK2 KHÁ</li>
                <li><span class="grade-badge dat">ĐẠT</span> 2 HK ĐẠT, <strong>hoặc</strong> HK2 ĐẠT</li>
                <li><span class="grade-badge cd">CHƯA ĐẠT</span> HK2 bị CHƯA ĐẠT</li>
            </ul>
        </div>`;
        html += '</div>';

        // Lời nhắc
        html += `<div class="warn-box">
            <strong>Lưu ý quan trọng:</strong><br>
            • Lỗi vi phạm trùng nhiều mục → áp dụng mức trừ <strong>cao nhất</strong>.<br>
            • Điểm cộng vượt 100đ vẫn được giữ, không giới hạn trần.<br>
            • <strong>GVCN là người quyết định cuối cùng</strong> trong các trường hợp đặc biệt.
        </div>`;

        container.innerHTML = html;
        container.dataset.rendered = '1';
        container.dataset.sig = ERROR_TYPES.length + '_' + ERROR_TYPES.map(r => r.key).join(',');
    }

    /* ============ 4. ẨN/HIỆN NỘP MINH CHỨNG ============ */
    function updateMinhChungVisibility() {
        const now = new Date();
        const activeContests = Object.entries(STATE.photoContests || {})
            .filter(([_, c]) => c.active && new Date(c.deadline) > now);
        const hasContest = activeContests.length > 0;

        const sbBtn = document.getElementById('sidebar-minhchung');
        if (sbBtn) {
            sbBtn.style.display = hasContest ? 'flex' : 'none';
            sbBtn.classList.toggle('sidebar-highlight', hasContest);
        }
    }

    /* ============ 5. HOOK + CHẠY ============ */
    function runAll() {
        restructureSidebar();
        restructurePanels();
        renderDetailedRules();
        updateMinhChungVisibility();
    }

    const _origSwitch = window.switchMainTab;
    window.switchMainTab = function(tabId) {
        if (typeof _origSwitch === 'function') _origSwitch.apply(this, arguments);
        if (tabId === 'tab1') setTimeout(runAll, 400);
    };

    // Chạy khi có thay đổi nội quy
    const _origRebuild = window.rebuildErrorTypes;
    window.rebuildErrorTypes = function() {
        if (typeof _origRebuild === 'function') _origRebuild.apply(this, arguments);
        const c = document.getElementById('noiquy-content');
        if (c) c.dataset.rendered = '';
        setTimeout(renderDetailedRules, 200);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(runAll, 2500));
    } else {
        setTimeout(runAll, 2500);
    }

    setInterval(() => {
        restructureSidebar();
        restructurePanels();
        if (document.getElementById('noiquy-content')?.dataset.rendered !== '1') {
            renderDetailedRules();
        }
        updateMinhChungVisibility();
    }, 3000);

    console.log('[OK] PATCH GỘP CUỐI: NỘI QUY LỚP + SIDEBAR MỚI — ĐÃ ÁP DỤNG');
})();

/* ============================================================
   PATCH: TỔNG HỢP NGHỈ HỌC TRONG TRANG TRA CỨU CÁ NHÂN (TAB 1)
============================================================ */
(function(){
    'use strict';

    function getTargetWeeks(searchType, periodVal) {
        let weeks = [];
        if (searchType === 'week') weeks = [periodVal];
        else if (periodVal.startsWith("Tháng")) weeks = (MONTH_WEEKS[periodVal] || []).map(w => "Tuần " + w);
        else if (periodVal === "Học Kỳ 1") ["Tháng 9","Tháng 10","Tháng 11","Tháng 12"].forEach(m => (MONTH_WEEKS[m] || []).forEach(w => weeks.push("Tuần " + w)));
        else if (periodVal === "Học Kỳ 2") ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5"].forEach(m => (MONTH_WEEKS[m] || []).forEach(w => weeks.push("Tuần " + w)));
        else if (periodVal === "Cả Năm") for (let i = 1; i <= 35; i++) weeks.push("Tuần " + i);
        return weeks;
    }

    function calcLeave(stt, weeks) {
        let totalCP = 0, totalKP = 0;
        const details = [];
        weeks.forEach(weekName => {
            const isSub = isStudentWeekSubmitted(stt, weekName);
            const data = STATE.emulation[weekName]?.[stt] || {};
            const cp = isSub ? (Number(data.cp) || 0) : 0;
            const kp = isSub ? (Number(data.kp) || 0) : 0;
            totalCP += cp;
            totalKP += kp;
            details.push({ week: weekName, cp, kp, hasData: isSub });
        });
        return { totalCP, totalKP, details };
    }

    function buildLeaveHTML(stt, searchType, periodVal) {
        const weeks = getTargetWeeks(searchType, periodVal);
        const { totalCP, totalKP, details } = calcLeave(stt, weeks);

        if (totalCP === 0 && totalKP === 0) {
            return `<div data-leave-block="1" style="background:linear-gradient(135deg,#f0fdf4,#dcfce7); border:2px solid #86efac; border-radius:14px; padding:14px; margin:12px 0; display:flex; align-items:center; gap:12px;">
                <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">✓</div>
                <div>
                    <div style="font-size:0.88rem; font-weight:800; color:#166534;">Không nghỉ buổi nào</div>
                    <div style="font-size:0.72rem; color:#15803d;">Đi học đầy đủ trong kỳ này</div>
                </div>
            </div>`;
        }

        let detailRows = '';
        details.forEach(d => {
            if (!d.hasData) return;
            const cpText = d.cp > 0 ? `<span style="color:#d97706;font-weight:800;margin-right:6px;">${d.cp} CP</span>` : '';
            const kpText = d.kp > 0 ? `<span style="color:#dc2626;font-weight:800;">${d.kp} KP</span>` : '';
            const info = (d.cp === 0 && d.kp === 0)
                ? '<span style="color:#94a3b8;font-style:italic;">Không nghỉ</span>'
                : (cpText + kpText);
            detailRows += `<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #fef3c7;font-size:0.78rem;">
                <span style="font-weight:700;color:#475569;">${d.week}</span>
                <span>${info}</span>
            </div>`;
        });
        if (!detailRows) detailRows = '<div style="text-align:center;padding:8px;color:#94a3b8;font-style:italic;font-size:0.78rem;">Chưa có tuần nào được chấm</div>';

        return `<div data-leave-block="1" style="background:linear-gradient(135deg,#fffbeb,#fef3c7); border:2px solid #f59e0b; border-radius:14px; padding:14px; margin:12px 0;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding-bottom:10px;border-bottom:1.5px dashed rgba(245,158,11,0.4);">
                <div style="width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;">📅</div>
                <div>
                    <div style="font-size:0.92rem;font-weight:800;color:#92400e;">Tổng hợp nghỉ học</div>
                    <div style="font-size:0.7rem;color:#a16207;">Kỳ: ${periodVal}</div>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
                <div style="background:#fff;border:1.5px solid #fbbf24;border-radius:10px;padding:10px;text-align:center;">
                    <div style="font-size:1.7rem;font-weight:900;color:#d97706;line-height:1;">${totalCP}</div>
                    <div style="font-size:0.65rem;font-weight:800;color:#92400e;text-transform:uppercase;margin-top:4px;">Nghỉ có phép</div>
                    <div style="font-size:0.68rem;color:#64748b;margin-top:3px;">−${totalCP * 20}đ</div>
                </div>
                <div style="background:#fff;border:1.5px solid #ef4444;border-radius:10px;padding:10px;text-align:center;">
                    <div style="font-size:1.7rem;font-weight:900;color:#dc2626;line-height:1;">${totalKP}</div>
                    <div style="font-size:0.65rem;font-weight:800;color:#991b1b;text-transform:uppercase;margin-top:4px;">Nghỉ không phép</div>
                    <div style="font-size:0.68rem;color:#64748b;margin-top:3px;">−${totalKP * 50}đ</div>
                </div>
            </div>
            <div style="background:#fff;border-radius:10px;padding:10px;">
                <div style="font-size:0.7rem;font-weight:800;color:#92400e;margin-bottom:6px;">CHI TIẾT THEO TUẦN</div>
                ${detailRows}
            </div>
        </div>`;
    }

    function injectLeaveBlock(sttId, typeId, weekId, monthId, reportId) {
        const stt = document.getElementById(sttId)?.value;
        const searchType = document.getElementById(typeId)?.value;
        const reportDiv = document.getElementById(reportId);
        if (!stt || !reportDiv || reportDiv.style.display === 'none' || !reportDiv.innerHTML.trim()) return;

        const periodVal = searchType === 'week'
            ? document.getElementById(weekId)?.value
            : document.getElementById(monthId)?.value;
        if (!periodVal) return;

        reportDiv.querySelectorAll('[data-leave-block="1"]').forEach(el => el.remove());

        const flexContainer = Array.from(reportDiv.querySelectorAll('div')).find(el => {
            const s = el.getAttribute('style') || '';
            return s.includes('display:flex') && s.includes('flex-wrap:wrap');
        });

        const html = buildLeaveHTML(parseInt(stt), searchType, periodVal);
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const blockEl = temp.firstElementChild;

        if (flexContainer) {
            flexContainer.parentElement.insertBefore(blockEl, flexContainer);
        } else {
            reportDiv.appendChild(blockEl);
        }
    }

    const _origView = window.viewStudentDetails;
    window.viewStudentDetails = function() {
        if (typeof _origView === 'function') _origView.apply(this, arguments);
        setTimeout(() => injectLeaveBlock(
            'public-student-select', 'search-type-select',
            'public-detail-week-select', 'public-detail-month-select',
            'student-detail-report'
        ), 150);
    };

    const _origViewM = window.viewStudentDetailsMobile;
    window.viewStudentDetailsMobile = function() {
        if (typeof _origViewM === 'function') _origViewM.apply(this, arguments);
        setTimeout(() => injectLeaveBlock(
            'mobile-student-select', 'mobile-search-type',
            'mobile-detail-week-select', 'mobile-detail-month-select',
            'mobile-student-detail-report'
        ), 150);
    };

    console.log('[OK] PATCH: TỔNG HỢP NGHỈ HỌC — ĐÃ ÁP DỤNG');
})();

/* ============================================================
   FIX: STATE.respRoles bị null → chặn render toàn bộ
============================================================ */
(function(){
    'use strict';
    const DEFAULT_ROLES = [
        { name: 'Lớp trưởng', points: 30 },
        { name: 'Bí thư',     points: 30 },
        { name: 'Lớp phó',    points: 20 },
        { name: 'Tổ trưởng',  points: 20 },
        { name: 'Sao đỏ',     points: 10 },
        { name: 'Giữ SĐB',    points: 10 }
    ];

    function ensureRespRoles() {
        if (typeof STATE === 'undefined') return;
        if (!Array.isArray(STATE.respRoles) || !STATE.respRoles.length) {
            try {
                const saved = localStorage.getItem('respRoles');
                const parsed = saved ? JSON.parse(saved) : null;
                STATE.respRoles = (Array.isArray(parsed) && parsed.length) ? parsed : [...DEFAULT_ROLES];
            } catch(e) {
                STATE.respRoles = [...DEFAULT_ROLES];
            }
        }
    }

    ensureRespRoles();
    setInterval(ensureRespRoles, 1500);

    const _orig = window.renderRespRoles;
    window.renderRespRoles = function() {
        ensureRespRoles();
        if (typeof _orig === 'function') _orig.apply(this, arguments);
    };

    const _origSwitch = window.switchMainTab;
    window.switchMainTab = function(tabId) {
        if (typeof _origSwitch === 'function') _origSwitch.apply(this, arguments);
        if (tabId === 'tab3') {
            ensureRespRoles();
            setTimeout(() => {
                if (typeof renderRespRoles === 'function') renderRespRoles();
            }, 400);
        }
    };

    console.log('[OK] FIX respRoles null — ĐÃ ÁP DỤNG');
})();

/* ============================================================
   PATCH v3: CHÈN 2 CỘT NGHỈ CP/KP — FIX BUG STT DO SORT
   - Lấy STT từ <td> đầu tiên của hàng (không dùng idx)
   - Luôn hiển thị, ghi 0 nếu không ai nghỉ
============================================================ */
(function(){
    'use strict';

    /* ---------- Vô hiệu hóa patch cũ (2 khối stats) ---------- */
    window.injectClassLeaveStats = function(){};
    document.querySelectorAll('.leave-stats-block').forEach(el => el.remove());

    /* ---------- Helper ---------- */
    function weeksOfPeriod(period) {
        if (!period) return [];
        if (period.startsWith('Tuần ')) return [period];
        if (period.startsWith('Tháng')) return (MONTH_WEEKS[period] || []).map(w => 'Tuần ' + w);
        if (period === 'Học Kỳ 1')
            return ['Tháng 9','Tháng 10','Tháng 11','Tháng 12']
                .reduce((a, m) => a.concat((MONTH_WEEKS[m] || []).map(w => 'Tuần ' + w)), []);
        if (period === 'Học Kỳ 2')
            return ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5']
                .reduce((a, m) => a.concat((MONTH_WEEKS[m] || []).map(w => 'Tuần ' + w)), []);
        if (period === 'Cả Năm') {
            const a = [];
            for (let i = 1; i <= 35; i++) a.push('Tuần ' + i);
            return a;
        }
        return [];
    }

    function countLeave(stt, weeks) {
        let cp = 0, kp = 0;
        weeks.forEach(wk => {
            if (!isStudentWeekSubmitted(stt, wk)) return;
            const d = STATE.emulation?.[wk]?.[stt] || {};
            cp += Number(d.cp) || 0;
            kp += Number(d.kp) || 0;
        });
        return { cp, kp };
    }

    /* ---------- Chèn 2 cột ---------- */
    function injectLeaveColumns() {
        const mode = document.getElementById('emulation-view-mode')?.value;
        const thead = document.getElementById('public-summary-thead');
        const tbody = document.getElementById('public-summary-tbody');
        if (!thead || !tbody || !mode) return;

        // Dọn cột cũ (nếu có)
        thead.querySelectorAll('.pub-leave-th-cp,.pub-leave-th-kp').forEach(el => el.remove());
        tbody.querySelectorAll('.pub-leave-td-cp,.pub-leave-td-kp').forEach(el => el.remove());

        const hr = thead.querySelector('tr');
        if (!hr) return;
        const ths = hr.querySelectorAll('th');
        if (!ths.length) return;

        // Xác định kỳ
        let period = '', insertBeforeText = '';
        if (mode === 'week') {
            period = document.getElementById('public-week-select')?.value || 'Tuần 1';
            insertBeforeText = 'Điểm tuần';
        } else if (mode === 'month') {
            period = document.getElementById('public-month-select')?.value || 'Tháng 9';
            insertBeforeText = 'Điểm TB';
        } else if (mode === 'semester') {
            period = 'Cả Năm';
            insertBeforeText = 'HK1';
        } else if (mode === 'year') {
            period = 'Cả Năm';
            insertBeforeText = 'Xếp Loại Cả Năm';
        }

        // Tìm vị trí chèn
        let insertIdx = -1;
        ths.forEach((th, i) => {
            if (th.textContent.trim() === insertBeforeText) insertIdx = i;
        });
        if (insertIdx === -1) insertIdx = ths.length;

        // Header 2 cột
        const thCp = document.createElement('th');
        thCp.className = 'pub-leave-th-cp';
        thCp.textContent = 'Nghỉ CP';
        thCp.style.cssText = 'background:#fef3c7;color:#92400e;padding:8px 6px;font-size:0.75rem;text-align:center;width:65px;white-space:nowrap;';
        hr.insertBefore(thCp, ths[insertIdx] || null);

        const thKp = document.createElement('th');
        thKp.className = 'pub-leave-th-kp';
        thKp.textContent = 'Nghỉ KP';
        thKp.style.cssText = 'background:#fee2e2;color:#991b1b;padding:8px 6px;font-size:0.75rem;text-align:center;width:65px;white-space:nowrap;';
        hr.insertBefore(thKp, thCp.nextSibling);

        // Điền dữ liệu — LẤY STT TỪ <td> ĐẦU TIÊN
        const weeks = weeksOfPeriod(period);
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((row) => {
            if (row.querySelector('td[colspan]')) return;

            const firstTd = row.querySelector('td:first-child');
            const stt = parseInt(firstTd?.textContent?.trim() || '0');
            if (!stt) return;

            const { cp, kp } = countLeave(stt, weeks);

            const tds = row.querySelectorAll('td');
            const refCell = tds[insertIdx];
            if (!refCell) return;

            const tdCp = document.createElement('td');
            tdCp.className = 'pub-leave-td-cp';
            tdCp.textContent = cp;
            tdCp.style.cssText =
                'text-align:center;padding:8px 6px;font-size:0.85rem;background:#fffbeb;' +
                (cp === 0
                    ? 'color:#cbd5e1;font-weight:500;'
                    : 'color:#d97706;font-weight:800;');
            refCell.parentNode.insertBefore(tdCp, refCell);

            const tdKp = document.createElement('td');
            tdKp.className = 'pub-leave-td-kp';
            tdKp.textContent = kp;
            tdKp.style.cssText =
                'text-align:center;padding:8px 6px;font-size:0.85rem;background:#fef2f2;' +
                (kp === 0
                    ? 'color:#cbd5e1;font-weight:500;'
                    : 'color:#dc2626;font-weight:800;');
            refCell.parentNode.insertBefore(tdKp, refCell);
        });
    }
    window.injectLeaveColumns = injectLeaveColumns;

    /* ---------- Hook ---------- */
    const _origRender = window.renderPublicSummaryTable;
    window.renderPublicSummaryTable = function() {
        if (typeof _origRender === 'function') _origRender.apply(this, arguments);
        document.querySelectorAll('.leave-stats-block').forEach(el => el.remove());
        setTimeout(injectLeaveColumns, 100);
        setTimeout(injectLeaveColumns, 400);
    };

    document.addEventListener('change', (e) => {
        if (!e.target) return;
        if (['public-week-select','public-month-select','emulation-view-mode'].includes(e.target.id)) {
            setTimeout(injectLeaveColumns, 200);
            setTimeout(injectLeaveColumns, 500);
        }
    });

    setInterval(() => {
        document.querySelectorAll('.leave-stats-block').forEach(el => el.remove());
        const thead = document.getElementById('public-summary-thead');
        if (thead && !thead.querySelector('.pub-leave-th-cp')) injectLeaveColumns();
    }, 2000);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(injectLeaveColumns, 1500));
    } else {
        setTimeout(injectLeaveColumns, 1500);
    }

    console.log('%c[OK] PATCH v3: NGHỈ CP/KP — FIX BUG STT — ĐÃ ÁP DỤNG',
        'color:#16a34a;font-weight:bold;');
})();
/* ============================================================
   GIAI ĐOẠN 2 - ĐỢT 2: KHÓA 5 PHÚT + MỞ KHÓA + TRUY VẾT
============================================================ */
(function(){
    'use strict';

    const EDIT_LOCK_MS = 5 * 60 * 1000;    // 5 phút
    const EDIT_UNLOCK_MS = 30 * 60 * 1000; // 30 phút

    /* ===== Helper ===== */
    window.getLockKey = function(role, groupId) {
        if (role === 'loptruong') return 'loptruong';
        if (role === 'lophoLĐ') return 'lophoLĐ';
        return 'to' + groupId;
    };

    window.getEditLockInfo = function(week, lockKey) {
        if (!STATE.editLocks) STATE.editLocks = {};
        if (!STATE.editLocks[week]) return null;
        return STATE.editLocks[week][lockKey] || null;
    };

    window.isEditWindowOpen = function(week, lockKey) {
        const info = window.getEditLockInfo(week, lockKey);
        if (!info) return true;
        const now = Date.now();
        if (info.unlockedUntil && now < info.unlockedUntil) return true;
        if (info.lockedAt && now < info.lockedAt) return true;
        return false;
    };

    window.getEditLockRemainingMs = function(week, lockKey) {
        const info = window.getEditLockInfo(week, lockKey);
        if (!info) return 0;
        const now = Date.now();
        if (info.unlockedUntil && now < info.unlockedUntil) return info.unlockedUntil - now;
        if (info.lockedAt && now < info.lockedAt) return info.lockedAt - now;
        return 0;
    };

    window.createOrUpdateEditLock = function(week, lockKey, submittedBy) {
        if (!STATE.editLocks) STATE.editLocks = {};
        if (!STATE.editLocks[week]) STATE.editLocks[week] = {};
        const prev = STATE.editLocks[week][lockKey] || {};
        STATE.editLocks[week][lockKey] = {
            lockedAt: Date.now() + EDIT_LOCK_MS,
            submittedBy: submittedBy,
            unlockedUntil: 0,
            unlockedAt: null,
            unlockHistory: prev.unlockHistory || []
        };
        saveData('editLocks', STATE.editLocks);
    };

    /* ===== Override finalizeReport ===== */
    const _origFinalize = window.finalizeReport;
    window.finalizeReport = function(groupId) {
        const week = document.getElementById("input-week-select").value;
        const role = window.currentInputRole || 'totruong';

        if (!confirm(`Xác nhận nộp báo cáo ${week}?\n\n⚠️ Sau 5 PHÚT kể từ bây giờ, hệ thống sẽ TỰ ĐỘNG KHÓA. Muốn sửa phải nhờ GVCN mở khóa.`)) return;

        if (!STATE.emulation[week]) STATE.emulation[week] = {};

        let submittedBy = '';
        if (groupId) {
            STATE.emulation[week]['to' + groupId + '_submitted'] = true;
            submittedBy = 'Tổ trưởng Tổ ' + groupId;
        } else {
            STATE.emulation[week]['loptruong_submitted'] = true;
            submittedBy = 'Lớp trưởng';
        }

        saveData('emulation', STATE.emulation);

        const lockKey = window.getLockKey(role, groupId);
        window.createOrUpdateEditLock(week, lockKey, submittedBy);

        alert("✅ Đã nộp báo cáo!\n\nHệ thống sẽ tự động KHÓA SỬA sau 5 phút. GVCN có thể mở khóa trong Tab Quản trị.");
        window.verifyAuthAndRender();
    };

    /* ===== Override verifyAuthAndRender để check lock ===== */
    const _origVerify = window.verifyAuthAndRender;
    window.verifyAuthAndRender = async function() {
        if (typeof _origVerify === 'function') {
            await _origVerify.apply(this, arguments);
        }
    // ⬇️⬇️⬇️ TKB THEO TUẦN — Hiện khi Lớp trưởng mở khóa đúng ⬇️⬇️⬇️
    if (window.currentInputRole === 'loptruong') {
        setTimeout(() => {
            const hasSubmitBtn = [...document.querySelectorAll('button')]
                .some(b => /CHỐT.*GỬI|GỬI.*BÁO CÁO/i.test(b.textContent));
            if (!hasSubmitBtn) return;

            const target = document.getElementById('panel-tab2');
            if (!target) return;
            let c = document.getElementById('tkb-by-week-container');
            if (!c) {
                c = document.createElement('div');
                c.id = 'tkb-by-week-container';
                c.style.cssText = 'margin:20px 0;';
                target.appendChild(c);
            } else if (!target.contains(c)) {
                target.appendChild(c);
            }
            if (typeof renderTkbByWeekUI === 'function') renderTkbByWeekUI();
        }, 300);
    }
    // ⬆️⬆️⬆️
        try {
            const role = window.currentInputRole || 'totruong';
            const groupId = document.getElementById('select-group-id')?.value;
            const week = document.getElementById('input-week-select')?.value;
            if (!week) return;

            const lockKey = window.getLockKey(role, groupId);
            const subKey = groupId ? ('to' + groupId + '_submitted') : 'loptruong_submitted';
            const isSubmitted = STATE.emulation?.[week]?.[subKey];
            if (!isSubmitted) return;

            const isOpen = window.isEditWindowOpen(week, lockKey);
            const alertBox = document.getElementById('lock-status-alert');

            if (!isOpen) {
                if (alertBox) {
                    alertBox.style.display = 'block';
                    alertBox.style.background = "#fef2f2";
                    alertBox.style.color = "#991b1b";
                    alertBox.style.border = "1.5px solid #f87171";
                    alertBox.innerHTML = '🔒 <b>ĐÃ KHÓA SỬA ĐIỂM</b><br>Bạn đã nộp báo cáo và quá 5 phút chỉnh sửa.<br>Muốn sửa tiếp, vui lòng <b>liên hệ GVCN mở khóa</b>.';
                }
                document.querySelectorAll('#group-member-entry-container .btn-count, #group-member-entry-container .count-val, #group-member-entry-container input[type=checkbox]').forEach(el => { el.disabled = true; });
                const fb = document.querySelector('#group-member-entry-container button[onclick*="finalizeReport"]');
                if (fb) fb.style.display = 'none';
                return;
            }

            const remainMs = window.getEditLockRemainingMs(week, lockKey);
            const info = window.getEditLockInfo(week, lockKey);
            const isUnlockedByGVCN = info?.unlockedUntil > Date.now();

            if (alertBox && remainMs > 0) {
                alertBox.style.display = 'block';
                alertBox.style.background = isUnlockedByGVCN ? "#eff6ff" : "#fffbeb";
                alertBox.style.color = isUnlockedByGVCN ? "#1e40af" : "#92400e";
                alertBox.style.border = isUnlockedByGVCN ? "1px solid #bfdbfe" : "1px solid #fde047";
                alertBox.innerHTML = (isUnlockedByGVCN ? '🔓 GVCN đã mở khóa' : '⏳ Sắp tự khóa') + '. Còn <strong id="edit-countdown">...</strong> để sửa.';
                window.startEditCountdown(week, lockKey);
            }
        } catch(e) { console.error('Lock check:', e); }
    };

    /* ===== Countdown ===== */
    let _cdTimer = null;
    window.startEditCountdown = function(week, lockKey) {
        if (_cdTimer) clearInterval(_cdTimer);
        _cdTimer = setInterval(() => {
            const el = document.getElementById('edit-countdown');
            if (!el) { clearInterval(_cdTimer); _cdTimer = null; return; }
            const remainMs = window.getEditLockRemainingMs(week, lockKey);
            if (remainMs <= 0) {
                clearInterval(_cdTimer); _cdTimer = null;
                window.verifyAuthAndRender();
                return;
            }
            const m = Math.floor(remainMs / 60000);
            const s = Math.floor((remainMs % 60000) / 1000);
            el.textContent = m + 'p' + String(s).padStart(2,'0') + 's';
        }, 1000);
    };

    /* ===== GVCN mở khóa ===== */
    window.gvcnUnlockEdit = function(week, lockKey) {
        if (!window.isTeacherLoggedIn) return alert('🚫 Chỉ GVCN đã đăng nhập mới có quyền mở khóa!');
        if (!STATE.editLocks?.[week]?.[lockKey]) return alert('Không có bản ghi khóa!');

        const reason = prompt('📝 Nhập lý do mở khóa (sẽ ghi vào truy vết):', '');
        if (reason === null) return;

        const info = STATE.editLocks[week][lockKey];
        if (!info.unlockHistory) info.unlockHistory = [];
        info.unlockHistory.push({
            by: 'GVCN',
            at: new Date().toISOString(),
            reason: (reason || '').trim() || '(không ghi lý do)'
        });
        info.unlockedUntil = Date.now() + EDIT_UNLOCK_MS;
        info.unlockedAt = new Date().toISOString();
        info.unlockedBy = 'GVCN';
        saveData('editLocks', STATE.editLocks);
        alert(`✅ Đã mở khóa sửa điểm trong ${EDIT_UNLOCK_MS/60000} phút.`);
        renderLockManager();
    };

    window.relockEdit = function(week, lockKey) {
        if (!window.isTeacherLoggedIn) return;
        if (!STATE.editLocks?.[week]?.[lockKey]) return;
        if (!confirm('Khóa lại ngay?')) return;
        STATE.editLocks[week][lockKey].unlockedUntil = 0;
        saveData('editLocks', STATE.editLocks);
        renderLockManager();
    };

    /* ===== Lock Manager UI ===== */
    window.renderLockManager = function() {
        const container = document.getElementById('lock-manager-container');
        if (!container) return;

        const locks = STATE.editLocks || {};
        const rows = [];
        Object.keys(locks).forEach(week => {
            Object.keys(locks[week]).forEach(lockKey => {
                rows.push({ week, lockKey, info: locks[week][lockKey] });
            });
        });
        rows.sort((a, b) => (b.info.lockedAt || 0) - (a.info.lockedAt || 0));

        let html = `<div style="background:#fef2f2; border:1.5px solid #f87171; border-radius:12px; padding:14px;">
            <h4 style="color:#991b1b; font-size:1rem; margin-bottom:8px;">🔓 QUẢN LÝ KHÓA SỬA ĐIỂM</h4>
            <p style="font-size:0.82rem; color:#7f1d1d; margin-bottom:10px;">Các tuần/tổ đã nộp báo cáo. GVCN có thể mở khóa 30 phút. Truy vết lưu vĩnh viễn.</p>`;

        if (!rows.length) {
            html += `<div style="background:#fff; padding:14px; border-radius:8px; text-align:center; color:#94a3b8; font-style:italic;">
                Chưa có bản ghi khóa. Khi tổ trưởng nộp báo cáo, hệ thống tự tạo khóa sau 5 phút.
            </div>`;
        } else {
            html += `<div style="background:#fff; border-radius:8px; overflow:hidden;">
                <table style="width:100%; border-collapse:collapse; font-size:0.78rem;">
                    <thead><tr style="background:#fee2e2; color:#991b1b;">
                        <th style="padding:8px; border:1px solid #fecaca; text-align:left;">Tuần</th>
                        <th style="padding:8px; border:1px solid #fecaca;">Đối tượng</th>
                        <th style="padding:8px; border:1px solid #fecaca;">Trạng thái</th>
                        <th style="padding:8px; border:1px solid #fecaca; text-align:left;">Truy vết</th>
                        <th style="padding:8px; border:1px solid #fecaca; width:130px;">Thao tác</th>
                    </tr></thead><tbody>`;

            rows.forEach(r => {
                const info = r.info;
                const now = Date.now();
                const isUnlocked = info.unlockedUntil && now < info.unlockedUntil;
                const waiting = info.lockedAt && now < info.lockedAt;

                let status;
                if (isUnlocked) {
                    const m = Math.ceil((info.unlockedUntil - now) / 60000);
                    status = `<span style="background:#dbeafe;color:#1e40af;padding:3px 8px;border-radius:6px;font-weight:700;">🔓 Đang mở (${m}p)</span>`;
                } else if (waiting) {
                    const ms = info.lockedAt - now;
                    const m = Math.floor(ms / 60000);
                    const s = Math.floor((ms % 60000) / 1000);
                    status = `<span style="background:#fef3c7;color:#92400e;padding:3px 8px;border-radius:6px;font-weight:700;">⏳ Chờ ${m}p${String(s).padStart(2,'0')}s</span>`;
                } else {
                    status = `<span style="background:#fee2e2;color:#991b1b;padding:3px 8px;border-radius:6px;font-weight:700;">🔒 Đã khóa</span>`;
                }

                const hist = (info.unlockHistory || []).map(h =>
                    `<div style="font-size:0.72rem;color:#7f1d1d;border-bottom:1px dashed #fecaca;padding:4px 0;">
                        <b>${h.by}</b> — ${new Date(h.at).toLocaleString('vi-VN')}<br><i>Lý do: ${h.reason}</i>
                    </div>`
                ).join('') || '<i style="font-size:0.72rem;color:#94a3b8;">Chưa có</i>';

                const dispKey = r.lockKey === 'loptruong' ? 'Lớp trưởng'
                              : r.lockKey === 'lophoLĐ' ? 'Lớp phó LĐ'
                              : 'Tổ ' + r.lockKey.replace('to', '');

                const btn = isUnlocked
                    ? `<button onclick="window.relockEdit('${r.week}','${r.lockKey}')" class="btn-action btn-red" style="padding:6px 10px;font-size:0.72rem;">Khóa lại</button>`
                    : `<button onclick="window.gvcnUnlockEdit('${r.week}','${r.lockKey}')" class="btn-action btn-green" style="padding:6px 10px;font-size:0.72rem;">Mở khóa</button>`;

                html += `<tr>
                    <td style="padding:8px; border:1px solid #fecaca; font-weight:800;">${r.week}</td>
                    <td style="padding:8px; border:1px solid #fecaca; text-align:center;">${dispKey}</td>
                    <td style="padding:8px; border:1px solid #fecaca; text-align:center;">${status}</td>
                    <td style="padding:8px; border:1px solid #fecaca; text-align:left;">${hist}</td>
                    <td style="padding:8px; border:1px solid #fecaca; text-align:center;">${btn}</td>
                </tr>`;
            });
            html += '</tbody></table></div>';
        }
        html += '</div>';
        container.innerHTML = html;
    };

    /* ===== Auto refresh ===== */
    setInterval(() => {
        if (document.getElementById('panel-tab3')?.classList.contains('active')) {
            try { renderLockManager(); } catch(e) {}
        }
    }, 5000);

    /* ===== Inject Lock Manager UI ===== */
    function injectLockManager() {
        const panel = document.getElementById('q-lichkhoa');
        if (!panel) return;
        if (document.getElementById('lock-manager-container')) return;

        const div = document.createElement('div');
        div.id = 'lock-manager-container';
        div.style.cssText = 'margin-top:14px;';
        panel.appendChild(div);
        renderLockManager();
    }

    const _origSwitch = window.switchMainTab;
    window.switchMainTab = function(tabId) {
        if (typeof _origSwitch === 'function') _origSwitch.apply(this, arguments);
        if (tabId === 'tab3') {
            setTimeout(() => { injectLockManager(); renderLockManager(); }, 500);
        }
    };

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.sidebar-item[data-tab3="q-lichkhoa"]');
        if (btn) setTimeout(() => { injectLockManager(); renderLockManager(); }, 200);
    }, true);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(injectLockManager, 2000));
    } else {
        setTimeout(injectLockManager, 2000);
    }

    console.log('%c[OK] ĐỢT 2: KHÓA 5 PHÚT + MỞ KHÓA + TRUY VẾT', 'color:#16a34a;font-weight:bold;font-size:14px;');
})();
/* ============================================================
   PATCH: ĐỒNG BỘ ICON SIDEBAR TAB 1
============================================================ */
(function(){
    'use strict';
    const st = document.createElement('style');
    st.textContent = `
        @media (max-width: 768px) {
            /* Reset tất cả icon cũ */
            #panel-tab1 .sidebar-item::before { content: none !important; }

            /* Gán icon đồng loạt */
            #panel-tab1 .sidebar-item[data-tab1="p-thongbao"]::before {
                content: '\\f0f3' !important; font-family: 'Font Awesome 6 Free'; font-weight: 900; margin-right: 4px;
            }
            #panel-tab1 .sidebar-item[data-tab1="p-tracuu-cn"]::before,
            #panel-tab1 .sidebar-item[data-tab1="p-tracuu"]::before {
                content: '\\f002' !important; font-family: 'Font Awesome 6 Free'; font-weight: 900; margin-right: 4px;
            }
            #panel-tab1 .sidebar-item[data-tab1="p-minhchung"]::before {
                content: '\\f030' !important; font-family: 'Font Awesome 6 Free'; font-weight: 900; margin-right: 4px;
            }
            #panel-tab1 .sidebar-item[data-tab1="p-tracuu-lop"]::before {
                content: '\\f0c0' !important; font-family: 'Font Awesome 6 Free'; font-weight: 900; margin-right: 4px;
            }
            #panel-tab1 .sidebar-item[data-tab1="p-tkb"]::before {
                content: '\\f133' !important; font-family: 'Font Awesome 6 Free'; font-weight: 900; margin-right: 4px;
            }
            #panel-tab1 .sidebar-item[data-tab1="p-trucnhat"]::before {
                content: '\\f51a' !important; font-family: 'Font Awesome 6 Free'; font-weight: 900; margin-right: 4px;
            }
            #panel-tab1 .sidebar-item[data-tab1="p-sodo"]::before {
                content: '\\f00a' !important; font-family: 'Font Awesome 6 Free'; font-weight: 900; margin-right: 4px;
            }
            #panel-tab1 .sidebar-item[data-tab1="p-noiquy"]::before {
                content: '\\f24e' !important; font-family: 'Font Awesome 6 Free'; font-weight: 900; margin-right: 4px;
            }
        }
    `;
    document.head.appendChild(st);
    console.log('[OK] PATCH: ĐỒNG BỘ ICON SIDEBAR — ĐÃ ÁP DỤNG');
})();
/* ============================================================
   PATCH: FIX NÚT "NỘI QUY LỚP" ĐỒNG BỘ VỚI CÁC NÚT KHÁC
============================================================ */
(function(){
    'use strict';

    function fixNoiquyBtn() {
        const btn = document.querySelector('#panel-tab1 .sidebar-item[data-tab1="p-noiquy"]');
        if (!btn) return;

        // Xóa style inline đè
        btn.style.marginTop = '';
        btn.style.borderTop = '';
        btn.style.paddingTop = '';
        btn.style.cssText = '';

        // Đảm bảo có class chuẩn
        btn.classList.add('sidebar-item');
    }

    // Chạy lần đầu + định kỳ (vì nút được tạo động)
    fixNoiquyBtn();
    setInterval(fixNoiquyBtn, 1500);

    // Hook vào switchMainTab
    const _origSwitch = window.switchMainTab;
    window.switchMainTab = function(tabId) {
        if (typeof _origSwitch === 'function') _origSwitch.apply(this, arguments);
        if (tabId === 'tab1') setTimeout(fixNoiquyBtn, 200);
    };

    console.log('[OK] PATCH: FIX NÚT NỘI QUY — ĐÃ ÁP DỤNG');
})();
/* ============================================================
   PATCH: ẨN NÚT "NỘP MINH CHỨNG" KHI KHÔNG CÓ CUỘC THI
   Dùng setProperty với !important để đè mobile.css
============================================================ */
(function(){
    'use strict';
    
    function hideMinhChungIfNoContest() {
        const btn = document.getElementById('sidebar-minhchung');
        if (!btn) return;
        
        const now = new Date();
        const activeContests = Object.entries(STATE.photoContests || {})
            .filter(function(pair) {
                const c = pair[1];
                return c.active && new Date(c.deadline) > now;
            });
        
        if (activeContests.length === 0) {
            // Ẩn — dùng !important để đè mobile.css
            btn.style.setProperty('display', 'none', 'important');
        } else {
            // Hiện — bỏ !important, để CSS tự xử
            btn.style.removeProperty('display');
            btn.style.setProperty('display', 'flex', 'important');
        }
    }
    
    // Chạy liên tục
    setInterval(hideMinhChungIfNoContest, 1000);
    
    // Chạy khi F5
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(hideMinhChungIfNoContest, 200);
            setTimeout(hideMinhChungIfNoContest, 1000);
            setTimeout(hideMinhChungIfNoContest, 3000);
        });
    } else {
        setTimeout(hideMinhChungIfNoContest, 200);
        setTimeout(hideMinhChungIfNoContest, 1000);
        setTimeout(hideMinhChungIfNoContest, 3000);
    }
    
    console.log('[OK] PATCH: ẨN NÚT NỘP MINH CHỨNG — ĐÃ ÁP DỤNG');
})();
/* ============================================================
   PATCH: FIX PANEL "NỘP MINH CHỨNG" TRỐNG
============================================================ */
(function(){
    'use strict';
    
    function ensurePhotoSection() {
        const panel = document.getElementById('p-minhchung');
        if (!panel) return;
        
        // Nếu panel chưa có div photo-contest-section → thêm vào
        let section = panel.querySelector('#photo-contest-section');
        if (!section) {
            section = document.createElement('div');
            section.id = 'photo-contest-section';
            section.style.display = 'block';
            section.style.marginBottom = '14px';
            panel.appendChild(section);
        }
        
        // Force re-render
        if (typeof renderPublicPhotoSection === 'function') {
            renderPublicPhotoSection();
        }
    }
    
    // Chạy khi load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(ensurePhotoSection, 500);
            setTimeout(ensurePhotoSection, 2000);
            setTimeout(ensurePhotoSection, 4000);
        });
    } else {
        setTimeout(ensurePhotoSection, 500);
        setTimeout(ensurePhotoSection, 2000);
        setTimeout(ensurePhotoSection, 4000);
    }
    
    // Chạy khi chuyển tab
    const _origSwitch = window.switchMainTab;
    window.switchMainTab = function(tabId) {
        if (typeof _origSwitch === 'function') _origSwitch.apply(this, arguments);
        if (tabId === 'tab1') setTimeout(ensurePhotoSection, 300);
    };
    
    console.log('[OK] PATCH: FIX PANEL NỘP MINH CHỨNG');
})();

/* ============================================================
   PATCH: BỔ SUNG HÀM CHO PANEL SƠ ĐỒ LỚP MỚI
============================================================ */
(function(){
    'use strict';

    window.saveLayoutFromSelect = function() {
        const sel = document.getElementById('seating-layout-select');
        if (!sel) return;
        const layout = sel.value;
        if (!confirm('Đổi kiểu kê bàn sẽ xếp lại chỗ. Tiếp tục?')) return;
        STATE.seatingLayout = layout;
        saveData('seatingLayout', layout);
        if (typeof autoMapStudentsByGroup === 'function') autoMapStudentsByGroup();
        if (typeof renderAdminSeatingMap === 'function') renderAdminSeatingMap();
        if (typeof renderSeatingMap === 'function') renderSeatingMap();
        updateLayoutStatus();
    };

    window.resetGroupLabels = function() {
        if (!confirm('Reset nhãn tổ về mặc định?')) return;
        STATE.groupLabelSwap = { 1:1, 2:2, 3:3, 4:4 };
        saveData('groupLabelSwap', STATE.groupLabelSwap);
        if (typeof autoMapStudentsByGroup === 'function') autoMapStudentsByGroup();
        if (typeof renderAdminSeatingMap === 'function') renderAdminSeatingMap();
        if (typeof renderSeatingMap === 'function') renderSeatingMap();
        updateLayoutStatus();
    };

    function updateLayoutStatus() {
        const statusEl = document.getElementById('layout-status');
        const swap = STATE.groupLabelSwap || { 1:1, 2:2, 3:3, 4:4 };
        const layoutText = STATE.seatingLayout === '2x2x12' ? '2 dãy lớn (mỗi dãy 2 tổ)' : '4 dãy dọc (mỗi dãy 1 tổ)';

        if (statusEl) {
            statusEl.innerHTML = `📌 Layout: <strong>${layoutText}</strong> — Nhãn tổ: <strong>{ 1:${swap[1]}, 2:${swap[2]}, 3:${swap[3]}, 4:${swap[4]} }</strong>`;
        }

        const swapLabel = document.getElementById('label-swap-display');
        if (swapLabel) {
            swapLabel.textContent = `{ 1:${swap[1]}, 2:${swap[2]}, 3:${swap[3]}, 4:${swap[4]} }`;
        }

        const layoutSelect = document.getElementById('seating-layout-select');
        if (layoutSelect && layoutSelect.value !== STATE.seatingLayout) {
            layoutSelect.value = STATE.seatingLayout || '4x12';
        }
    }
    window.updateLayoutStatus = updateLayoutStatus;

    const _origSwitch = window.switchMainTab;
    window.switchMainTab = function(tabId) {
        if (typeof _origSwitch === 'function') _origSwitch.apply(this, arguments);
        if (tabId === 'tab3') setTimeout(updateLayoutStatus, 300);
    if (tabId === 'tab1') {
        setTimeout(() => {
            const target = document.getElementById('panel-tab1');
            if (!target) return;
            let c = document.getElementById('tkb-public-container');
            if (!c) {
                c = document.createElement('div');
                c.id = 'tkb-public-container';
                c.style.cssText = 'margin:16px 0;';
                target.appendChild(c);
            } else if (!target.contains(c)) {
                target.appendChild(c);
            }
            if (typeof renderTkbPublicView === 'function') renderTkbPublicView();
        }, 200);
    }
    };

    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.sidebar-item[data-tab3="q-sodo"]');
        if (btn) setTimeout(updateLayoutStatus, 200);
    }, true);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(updateLayoutStatus, 1500);
        });
    } else {
        setTimeout(updateLayoutStatus, 1500);
    }

    console.log('[OK] PATCH: UI SƠ ĐỒ LỚP MỚI');
})();

/* ============================================================
   PATCH: MẬT KHẨU — PLAIN CHỈ GVCN ĐỌC (cách B)
============================================================ */
(function(){
    'use strict';
    
    window.saveOnePassword = async function(key) {
        const input = document.getElementById('pw-new-' + key);
        const newPw = (input.value || '').trim();
        const status = document.getElementById('pw-manager-status');
        if (!newPw) { if(status) status.innerHTML = '<span style="color:#dc2626;">Chưa nhập!</span>'; return; }
        if (newPw.length < 4) { if(status) status.innerHTML = '<span style="color:#dc2626;">Từ 4 ký tự!</span>'; return; }
        
        const hash = await window.hashPassword(newPw);
        STATE.passwords[key] = { hash, updatedAt: new Date().toISOString() };
        window.saveData('passwords', STATE.passwords);
        
        if (!STATE.passwordsPrivate) STATE.passwordsPrivate = {};
        STATE.passwordsPrivate[key] = { plain: newPw, updatedAt: new Date().toISOString() };
        window.saveData('passwords_private', STATE.passwordsPrivate);
        
        if (input) input.value = '';
        if (typeof renderPasswordManager === 'function') renderPasswordManager();
        if (status) status.innerHTML = '<span style="color:#16a34a;font-weight:700;">✅ Đã lưu!</span>';
    };
    
    window.resetAllPasswords = async function() {
        if (!confirm('Đặt lại TẤT CẢ mật khẩu về mặc định?')) return;
        for (const role of PW_ROLES) {
            const hash = await window.hashPassword(role.default);
            STATE.passwords[role.key] = { hash, updatedAt: new Date().toISOString() };
            if (!STATE.passwordsPrivate) STATE.passwordsPrivate = {};
            STATE.passwordsPrivate[role.key] = { plain: role.default, updatedAt: new Date().toISOString() };
        }
        window.saveData('passwords', STATE.passwords);
        window.saveData('passwords_private', STATE.passwordsPrivate);
        if (typeof renderPasswordManager === 'function') renderPasswordManager();
        const st = document.getElementById('pw-manager-status');
        if (st) st.innerHTML = '<span style="color:#16a34a;">✅ Đã đặt lại mặc định!</span>';
    };
    
    window.renderPasswordManager = function() {
        const container = document.getElementById('password-manager-container');
        if (!container) return;
        
        const isGVCN = window.isTeacherLoggedIn === true;
        
        let html = '<div class="table-responsive" style="max-height:none;"><table style="min-width:0;"><thead><tr style="background:#fef3c7;color:#92400e;">'
            + '<th style="width:110px;">Vai trò</th>'
            + '<th style="text-align:left;">Mật khẩu hiện tại</th>'
            + '<th style="width:180px;">Đặt mật khẩu mới</th>'
            + '<th style="width:70px;">Lưu</th>'
            + '</tr></thead><tbody>';
        
        PW_ROLES.forEach(function(role) {
            const info = STATE.passwords[role.key] || {};
            const infoPriv = (STATE.passwordsPrivate || {})[role.key] || {};
            const hasPw = !!info.hash;
            
            let displayPw;
            if (!hasPw) {
                displayPw = '<span style="color:#dc2626;font-style:italic;">Chưa đặt</span>';
            } else if (isGVCN && infoPriv.plain) {
                displayPw = '<span style="color:#16a34a;font-weight:800;letter-spacing:2px;">' + infoPriv.plain + '</span> <span style="color:#64748b;font-size:0.7rem;">(chỉ GVCN thấy)</span>';
            } else if (isGVCN && !infoPriv.plain) {
                displayPw = '<span style="color:#f59e0b;font-style:italic;">(pass cũ — đặt lại nếu cần)</span>';
            } else {
                displayPw = '<span style="color:#94a3b8;font-style:italic;">🔒 Đã mã hóa</span>';
            }
            
            html += '<tr>'
                + '<td style="font-weight:800;color:#1e293b;text-align:center;">' + role.icon + ' ' + role.label + '</td>'
                + '<td style="font-family:monospace;background:#fffbeb;">' + displayPw + '</td>'
                + '<td><input type="text" id="pw-new-' + role.key + '" placeholder="Pass mới..." style="width:100%;padding:6px;border:1.5px solid #cbd5e1;border-radius:6px;font-family:monospace;font-size:0.82rem;"></td>'
                + '<td style="text-align:center;"><button class="btn-action" style="background:#f59e0b;padding:5px 10px;font-size:0.72rem;" onclick="saveOnePassword(\'' + role.key + '\')">Lưu</button></td>'
                + '</tr>';
        });
        
        html += '</tbody></table></div>'
            + '<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">'
            + '<button class="btn-action btn-red" style="padding:6px 12px;font-size:0.78rem;" onclick="resetAllPasswords()">Về mặc định</button>'
            + '</div>'
            + '<div style="margin-top:8px;padding:8px;background:#eff6ff;border-radius:6px;font-size:0.75rem;color:#1e40af;">'
            + '🔒 Mật khẩu dùng SHA-256 cho tổ trưởng + bản gốc chỉ GVCN đã login đọc được.'
            + '</div>'
            + '<div id="pw-manager-status" style="margin-top:8px;font-size:0.82rem;"></div>';
        
        container.innerHTML = html;
    };
    
    try {
        const v = localStorage.getItem('passwords_private');
        if (v && v !== 'null') STATE.passwordsPrivate = JSON.parse(v);
    } catch(e) {}
    
    console.log('[OK] PATCH: MẬT KHẨU — PLAIN CHỈ GVCN ĐỌC');
})();
/* ═══════════════════════════════════════════════════════════
   TKB THEO TUẦN — MODULE (Lớp trưởng nhập, học sinh xem)
   ═══════════════════════════════════════════════════════════ */

// ─── 4.1 HELPERS ────────────────────────────────────────────
window.DAYS_TKB = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

window.getWeekKey = function(date = new Date()) {
    // Tính tuần theo ngày khai giảng (STATE.config.startDate)
    const startStr = STATE.config?.startDate || '2026-09-07';
    const start = new Date(startStr + 'T00:00:00');
    const cur = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.floor((cur - start) / 86400000);
    const weekNo = Math.floor(diffDays / 7) + 1;
    if (weekNo < 1) return `${start.getFullYear()}-W01`;
    return `${start.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
};

window.getPrevWeekKey = function(weekKey) {
    const [y, w] = weekKey.split('-W').map(Number);
    if (w > 1) return `${y}-W${String(w - 1).padStart(2, '0')}`;
    return getWeekKey(new Date(y - 1, 11, 28));
};

window.getWeekLabel = function(weekKey) {
    const [y, w] = weekKey.split('-W').map(Number);
    const startStr = STATE.config?.startDate || '2026-09-07';
    const start = new Date(startStr + 'T00:00:00');
    const mon = new Date(start);
    mon.setDate(start.getDate() + (w - 1) * 7);
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
    const fmt = (d) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
    return `Tuần ${w} (${fmt(mon)} – ${fmt(sun)}/${mon.getFullYear()})`;
};

window.getListWeekKeys = function() {
    // Trả về đủ 40 tuần của năm học (tính từ STATE.config.startDate)
    const TOTAL_WEEKS = 40;
    const startStr = STATE.config?.startDate || '2026-09-07';
    const startYear = new Date(startStr + 'T00:00:00').getFullYear();
    const keys = [];
    for (let w = 1; w <= TOTAL_WEEKS; w++) {
        keys.push(`${startYear}-W${String(w).padStart(2, '0')}`);
    }
    // Nếu tuần hiện tại vượt quá 40 → thêm vào
    const cur = getWeekKey();
    if (!keys.includes(cur)) keys.push(cur);
    return keys;
};

// ─── 4.2 RENDER UI ──────────────────────────────────────────
window.renderTkbByWeekUI = function() {
    const container = document.getElementById('tkb-by-week-container');
    if (!container) return;

    const weekKeys = getListWeekKeys();
    const current = STATE._tkbSelectedWeek || getWeekKey();
    STATE._tkbSelectedWeek = current;

    const weekData = STATE.tkbByWeek[current] || {};
    const numTiet = STATE._tkbNumTiet || 5;

    container.innerHTML = `
    <div style="background:#f0fdf4;border:1.5px solid #22c55e;border-radius:10px;padding:12px;margin-bottom:12px;">
      <div style="font-weight:800;color:#15803d;font-size:0.95rem;margin-bottom:8px;">📅 TKB THEO TUẦN</div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px;">
        <label style="font-weight:700;font-size:0.85rem;">Chọn tuần:</label>
                <select id="tkb-week-select" onchange="onChangeWeek(this.value)"
                style="padding:6px 10px;border:1.5px solid #cbd5e1;border-radius:6px;font-weight:700;font-size:0.85rem;">
          ${weekKeys.map(k => {
              const hasData = STATE.tkbByWeek[k] && Object.keys(STATE.tkbByWeek[k]).length > 0;
              const mark = hasData ? '✅ ' : '   ';
              return `<option value="${k}" ${k===current?'selected':''}>${mark}${getWeekLabel(k)}</option>`;
          }).join('')}
        </select>
        <button onclick="copyPrevWeek()" class="btn-action btn-purple" style="padding:6px 12px;font-size:0.8rem;">📋 Sao chép tuần trước</button>
        <button onclick="clearTkbWeek()" class="btn-action btn-red" style="padding:6px 12px;font-size:0.8rem;">🗑 Xóa tuần này</button>
      </div>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;">
        <label style="font-weight:700;font-size:0.85rem;">Số tiết/ngày:</label>
        <input type="number" id="tkb-week-numtiet" value="${numTiet}" min="1" max="12"
               style="width:70px;padding:6px;border:1.5px solid #cbd5e1;border-radius:6px;text-align:center;font-weight:700;"
               onchange="STATE._tkbNumTiet = +this.value; renderTkbByWeekUI();">
      </div>
    </div>
    <div style="overflow-x:auto;margin-bottom:10px;">
      <table style="width:100%;border-collapse:collapse;font-size:0.8rem;">
        <thead>
          <tr style="background:#dcfce7;">
            <th style="padding:6px;border:1px solid #cbd5e1;width:80px;">Tiết</th>
            ${DAYS_TKB.map(d => `<th style="padding:6px;border:1px solid #cbd5e1;">${d}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${Array.from({length: numTiet}, (_, i) => `
            <tr>
              <td style="padding:4px;border:1px solid #cbd5e1;text-align:center;font-weight:700;background:#f8fafc;">Tiết ${i+1}</td>
              ${DAYS_TKB.map((_, d) => {
    const val = (weekData[String(d+2)] || [])[i] || '';
    const opts = (typeof SUBJECTS !== 'undefined' ? SUBJECTS : [])
        .map(s => `<option value="${s.code}" ${s.code===val?'selected':''}>${s.code} - ${s.name}</option>`).join('');
    return `<td style="padding:2px;border:1px solid #cbd5e1;">
        <select data-day="${d+2}" data-tiet="${i}"
                onchange="onTkbCellInput(this)"
                style="width:100%;border:none;padding:6px;font-size:0.75rem;background:transparent;outline:none;cursor:pointer;">
            <option value="">—</option>
            ${opts}
        </select>
    </td>`;
}).join('')}
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button onclick="saveTkbByWeek()" class="btn-action btn-green" style="flex:1;min-width:150px;padding:10px;font-weight:800;">💾 LƯU TKB TUẦN NÀY</button>
      <button onclick="clearTkbWeek()" class="btn-action btn-red" style="padding:10px 16px;">🗑 Xóa tuần này</button>
    </div>`;
};

// ─── 4.3 EVENT HANDLERS ─────────────────────────────────────
window.onChangeWeek = function(weekKey) {
    STATE._tkbSelectedWeek = weekKey;
    renderTkbByWeekUI();
};

window.onTkbCellInput = function(input) {
    const weekKey = STATE._tkbSelectedWeek;
    const day = input.dataset.day;
    const tiet = +input.dataset.tiet;
    const val = input.value.trim();
    if (!STATE.tkbByWeek[weekKey]) STATE.tkbByWeek[weekKey] = {};
    if (!Array.isArray(STATE.tkbByWeek[weekKey][day])) STATE.tkbByWeek[weekKey][day] = [];
    STATE.tkbByWeek[weekKey][day][tiet] = val;
};

window.addNewWeek = function() {
    const input = prompt('Nhập tuần mới (YYYY-Www, VD: 2025-W46):', getWeekKey());
    if (!input) return;
    if (!/^\d{4}-W\d{2}$/.test(input)) return alert('Sai định dạng! Phải là YYYY-Www');
    if (!STATE.tkbByWeek[input]) STATE.tkbByWeek[input] = {};
    STATE._tkbSelectedWeek = input;
    renderTkbByWeekUI();
};

window.copyPrevWeek = function() {
    const cur = STATE._tkbSelectedWeek;
    const prev = getPrevWeekKey(cur);
    if (!STATE.tkbByWeek[prev] || !Object.keys(STATE.tkbByWeek[prev]).length) {
        return alert(`Tuần trước (${getWeekLabel(prev)}) chưa có dữ liệu!`);
    }
    if (!confirm(`Sao chép TKB từ ${getWeekLabel(prev)} sang ${getWeekLabel(cur)}?`)) return;
    STATE.tkbByWeek[cur] = JSON.parse(JSON.stringify(STATE.tkbByWeek[prev]));
    renderTkbByWeekUI();
    alert('✅ Đã sao chép. Nhớ bấm LƯU!');
};

window.saveTkbByWeek = function() {
    saveData('tkbByWeek', STATE.tkbByWeek);
    alert('✅ Đã lưu TKB tuần ' + STATE._tkbSelectedWeek);
};

window.clearTkbWeek = function() {
    const cur = STATE._tkbSelectedWeek;
    if (!confirm(`Xóa toàn bộ TKB tuần ${getWeekLabel(cur)}?`)) return;
    STATE.tkbByWeek[cur] = {};
    renderTkbByWeekUI();
};
/* ═══════════════════════════════════════════════════════════
   TKB CÔNG KHAI — Sub-tab "Thời khóa biểu" (BẢN MỚI)
   ═══════════════════════════════════════════════════════════ */

window.ensurePublicTkbContainer = function() {
    const panel = document.getElementById('p-tkb');
    if (!panel) return null;
    const oldTable = document.getElementById('tkb-public-table');
    if (oldTable) oldTable.remove();
    [...panel.querySelectorAll('h2')].forEach(h => {
        if (/thời khóa biểu/i.test(h.textContent)) h.remove();
    });
    let c = document.getElementById('tkb-public-container');
    if (!c) {
        c = document.createElement('div');
        c.id = 'tkb-public-container';
        c.style.cssText = 'margin: 12px 0;';
        panel.appendChild(c);
    }
    return c;
};

window.renderTkbPublicView = function() {
    const container = ensurePublicTkbContainer();
    if (!container) return;
    const weekKeys = (typeof getListWeekKeys === 'function') ? getListWeekKeys() : [];
    const current = container.dataset.week || (typeof getWeekKey === 'function' ? getWeekKey() : weekKeys[0]);
    container.dataset.week = current;
    const weekData = STATE.tkbByWeek?.[current] || {};
    const numTiet = STATE._tkbNumTiet || 5;
    const hasAny = Object.values(weekData).some(arr => Array.isArray(arr) && arr.some(x => x));
    const hasAnyWeekData = Object.keys(STATE.tkbByWeek || {}).some(k => {
        const wd = STATE.tkbByWeek[k];
        return wd && Object.values(wd).some(a => Array.isArray(a) && a.some(x => x));
    });
    if (!hasAnyWeekData) {
        container.innerHTML = `<div style="background:#fef3c7;border:1.5px solid #f59e0b;border-radius:10px;padding:16px;text-align:center;color:#92400e;font-weight:700;">📭 Chưa có thời khóa biểu.</div>`;
        return;
    }
    container.innerHTML = `
    <div style="background:#eff6ff;border:1.5px solid #3b82f6;border-radius:10px;padding:12px;margin-bottom:12px;">
      <div style="font-weight:800;color:#1e40af;font-size:1rem;margin-bottom:8px;">📅 THỜI KHÓA BIỂU</div>
      <select id="tkb-public-week" onchange="onChangePublicWeek(this.value)" style="padding:6px 10px;border:1.5px solid #cbd5e1;border-radius:6px;font-weight:700;">
        ${weekKeys.map(k => {
            const wd = STATE.tkbByWeek?.[k];
            const has = wd && Object.values(wd).some(a => Array.isArray(a) && a.some(x => x));
            const mark = has ? '✅ ' : '   ';
            return `<option value="${k}" ${k===current?'selected':''}>${mark}${getWeekLabel(k)}</option>`;
        }).join('')}
      </select>
    </div>
    ${hasAny ? `
    <div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.82rem;background:#fff;">
      <thead><tr style="background:#dbeafe;">
        <th style="padding:8px;border:1px solid #93c5fd;">Tiết</th>
        ${DAYS_TKB.map(d => `<th style="padding:8px;border:1px solid #93c5fd;color:#1e40af;">${d}</th>`).join('')}
      </tr></thead>
      <tbody>
        ${Array.from({length: numTiet}, (_, i) => `
          <tr><td style="padding:6px;border:1px solid #cbd5e1;text-align:center;font-weight:800;background:#f1f5f9;">${i+1}</td>
            ${DAYS_TKB.map((_, d) => {
                const val = (weekData[String(d+2)] || [])[i] || '';
                const subj = (typeof SUBJECTS !== 'undefined' ? SUBJECTS : []).find(s => s.code === val);
                return `<td style="padding:8px;border:1px solid #cbd5e1;text-align:center;font-weight:700;color:${val?'#1e293b':'#cbd5e1'};">${subj?subj.code:(val||'—')}</td>`;
            }).join('')}
          </tr>`).join('')}
      </tbody>
    </table></div>` : `<div style="background:#fef3c7;border:1.5px solid #f59e0b;border-radius:10px;padding:16px;text-align:center;color:#92400e;font-weight:700;">📭 Tuần này chưa có TKB.</div>`}`;
};

window.onChangePublicWeek = function(weekKey) {
    const c = document.getElementById('tkb-public-container');
    if (c) c.dataset.week = weekKey;
    renderTkbPublicView();
};

window.hookPublicTkbSubtab = function() {
    document.querySelectorAll('.sidebar-item').forEach(btn => {
        if (/thời khóa biểu/i.test(btn.textContent)) {
            if (btn.dataset.tkbHooked) return;
            btn.dataset.tkbHooked = '1';
            btn.addEventListener('click', () => setTimeout(renderTkbPublicView, 50));
        }
    });
};
document.addEventListener('DOMContentLoaded', () => setTimeout(hookPublicTkbSubtab, 300));
setTimeout(hookPublicTkbSubtab, 800);
