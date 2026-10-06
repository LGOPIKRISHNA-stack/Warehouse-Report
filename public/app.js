// const app=document.getElementById('app');let token=localStorage.getItem('token'),me=JSON.parse(localStorage.getItem('me')||'null');
// const api=async(url,opt={})=>{opt.headers={...(opt.headers||{}),...(token?{Authorization:'Bearer '+token}:{})};if(opt.body&&typeof opt.body!=='string'){opt.headers['Content-Type']='application/json';opt.body=JSON.stringify(opt.body)}const r=await fetch(url,opt);const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.message||'Request failed');return d};
// function logout(){localStorage.clear();location.reload()}function loginView(){app.innerHTML=`<div class="shell"><div class="card login"><div class="brand">Warehouse Work Report</div><p class="muted">Login to view your warehouse work data.</p><div id="err"></div><div class="field"><label>Email</label><input id="email" type="email" placeholder="you@company.com"></div><br><div class="field"><label>Password</label><input id="password" type="password" placeholder="••••••••"></div><br><button class="btn primary" onclick="doLogin()">Login</button></div></div>`}
// async function doLogin(){try{const d=await api('/api/auth/login',{method:'POST',body:{email:email.value,password:password.value}});token=d.token;me=d.user;localStorage.setItem('token',token);localStorage.setItem('me',JSON.stringify(me));render()}catch(e){document.getElementById('err').innerHTML='<div class="error">'+e.message+'</div>'}}
// function layout(content){app.innerHTML=`<div class="shell"><div class="top"><div><div class="brand">Warehouse Work Report</div><div class="muted">${me.role==='admin'?'Admin Dashboard':'Employee Dashboard'}</div></div><div class="row"><span class="pill">${me.name}</span><button class="btn" onclick="logout()">Logout</button></div></div>${content}</div>`}
// async function employee(){const rows=await api('/api/reports');const total=k=>rows.reduce((s,r)=>s+(r[k]||0),0);layout(`<div class="grid"><div class="card stat">Scanned<b>${total('scanned')}</b></div><div class="card stat">Billed<b>${total('billed')}</b></div><div class="card stat">E-Way Bills<b>${total('ewayBills')}</b></div><div class="card stat">Mask Adding<b>${total('maskAdding')}</b></div></div><br><div class="card"><h2>My Daily Work</h2><table><thead><tr><th>Date</th><th>Scanned</th><th>Billed</th><th>E-Way Bills</th><th>Mask Adding</th><th>Notes</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.date}</td><td>${r.scanned}</td><td>${r.billed}</td><td>${r.ewayBills}</td><td>${r.maskAdding}</td><td>${r.notes||'-'}</td></tr>`).join('')}</tbody></table></div>`)}
// async function admin(){const emps=await api('/api/employees');let rows=[];let selected=emps[0]?._id||'';if(selected)rows=await api('/api/reports?employeeId='+selected);layout(`<div class="card"><h2>Add / Update Daily Data</h2><div id="msg"></div><div class="formgrid"><div class="field"><label>Employee</label><select id="emp">${emps.map(e=>`<option value="${e._id}">${e.name} — ${e.email}</option>`).join('')}</select></div><div class="field"><label>Date</label><input id="date" type="date" value="${new Date().toISOString().slice(0,10)}"></div><div class="field"><label>No. of Scanned</label><input id="scanned" type="number" min="0" value="0"></div><div class="field"><label>No. of Billed</label><input id="billed" type="number" min="0" value="0"></div><div class="field"><label>No. of E-Way Bills</label><input id="ewayBills" type="number" min="0" value="0"></div><div class="field"><label>Mask Adding</label><input id="maskAdding" type="number" min="0" value="0"></div><div class="field" style="grid-column:1/-1"><label>Notes</label><textarea id="notes" rows="2" placeholder="Any important work or pending item"></textarea></div></div><br><button class="btn primary" onclick="saveReport()">Save / Update</button></div><br><div class="card"><h2>Employee Daily Reports</h2><div class="row"><select id="filter" onchange="loadAdminReports()">${emps.map(e=>`<option value="${e._id}">${e.name}</option>`).join('')}</select></div><table><thead><tr><th>Date</th><th>Employee</th><th>Scanned</th><th>Billed</th><th>E-Way</th><th>Mask</th><th>Notes</th></tr></thead><tbody id="reportRows"></tbody></table></div>`);await loadAdminReports();document.getElementById('filter').value=selected}
// async function loadAdminReports(){const id=document.getElementById('filter').value;const rows=await api('/api/reports?employeeId='+id);document.getElementById('reportRows').innerHTML=rows.map(r=>`<tr><td>${r.date}</td><td>${r.employeeId?.name||''}</td><td>${r.scanned}</td><td>${r.billed}</td><td>${r.ewayBills}</td><td>${r.maskAdding}</td><td>${r.notes||'-'}</td></tr>`).join('')}
// async function saveReport(){try{await api('/api/reports',{method:'POST',body:{employeeId:emp.value,date:date.value,scanned:scanned.value,billed:billed.value,ewayBills:ewayBills.value,maskAdding:maskAdding.value,notes:notes.value}});document.getElementById('msg').innerHTML='<div class="notice">Saved successfully. Employee dashboards update automatically.</div>';await loadAdminReports()}catch(e){document.getElementById('msg').innerHTML='<div class="error">'+e.message+'</div>'}}
// function render(){me.role==='admin'?admin():employee()} if(token&&me)render();else loginView();
// if(token){const socket=io();socket.on('report:changed',()=>{if(me.role==='admin')loadAdminReports();else employee()})}




// const app = document.getElementById('app');

// let token = localStorage.getItem('token');
// let me = JSON.parse(localStorage.getItem('me') || 'null');

// const api = async (url, opt = {}) => {
//     opt.headers = {
//         ...(opt.headers || {}),
//         ...(token ? { Authorization: 'Bearer ' + token } : {})
//     };

//     if (opt.body && typeof opt.body !== 'string') {
//         opt.headers['Content-Type'] = 'application/json';
//         opt.body = JSON.stringify(opt.body);
//     }

//     const r = await fetch(url, opt);
//     const d = await r.json().catch(() => ({}));

//     if (!r.ok) {
//         throw Error(d.message || 'Request failed');
//     }

//     return d;
// };

// function logout() {
//     localStorage.clear();
//     location.reload();
// }

// function loginView() {
//     app.innerHTML = `
//         <div class="shell">
//             <div class="card login">
//                 <div class="brand">Warehouse Work Report</div>
//                 <p class="muted">Login to view your warehouse work data.</p>

//                 <div id="err"></div>

//                 <div class="field">
//                     <label>Email</label>
//                     <input id="email" type="email" placeholder="you@company.com">
//                 </div>

//                 <br>

//                 <div class="field">
//                     <label>Password</label>
//                     <input id="password" type="password" placeholder="••••••••">
//                 </div>

//                 <br>

//                 <button class="btn primary" onclick="doLogin()">
//                     Login
//                 </button>
//             </div>
//         </div>
//     `;
// }

// async function doLogin() {
//     try {
//         const d = await api('/api/auth/login', {
//             method: 'POST',
//             body: {
//                 email: email.value,
//                 password: password.value
//             }
//         });

//         token = d.token;
//         me = d.user;

//         localStorage.setItem('token', token);
//         localStorage.setItem('me', JSON.stringify(me));

//         render();

//     } catch (e) {
//         document.getElementById('err').innerHTML =
//             '<div class="error">' + e.message + '</div>';
//     }
// }

// function layout(content) {
//     app.innerHTML = `
//         <div class="shell">

//             <div class="top">

//                 <div>
//                     <div class="brand">Warehouse Work Report</div>
//                     <div class="muted">
//                         ${me.role === 'admin'
//                             ? 'Admin Dashboard'
//                             : 'Employee Dashboard'}
//                     </div>
//                 </div>

//                 <div class="row">
//                     <span class="pill">${me.name}</span>

//                     <button class="btn" onclick="logout()">
//                         Logout
//                     </button>
//                 </div>

//             </div>

//             ${content}

//         </div>
//     `;
// }


// /* =========================
//    EMPLOYEE DASHBOARD
// ========================= */

// async function employee() {

//     const rows = await api('/api/reports');

//     const total = key =>
//         rows.reduce((s, r) => s + (r[key] || 0), 0);

//     layout(`

//         <div class="grid">

//             <div class="card stat">
//                 Scanned
//                 <b>${total('scanned')}</b>
//             </div>

//             <div class="card stat">
//                 Billed
//                 <b>${total('billed')}</b>
//             </div>

//             <div class="card stat">
//                 E-Way Bills
//                 <b>${total('ewayBills')}</b>
//             </div>

//             <div class="card stat">
//                 Mask Adding
//                 <b>${total('maskAdding')}</b>
//             </div>

//         </div>

//         <br>

//         <div class="card">

//             <h2>My Daily Work</h2>

//             <table>

//                 <thead>
//                     <tr>
//                         <th>Date</th>
//                         <th>Scanned</th>
//                         <th>Billed</th>
//                         <th>E-Way Bills</th>
//                         <th>Mask Adding</th>
//                         <th>Notes</th>
//                     </tr>
//                 </thead>

//                 <tbody>

//                     ${rows.map(r => `
//                         <tr>
//                             <td>${r.date}</td>
//                             <td>${r.scanned}</td>
//                             <td>${r.billed}</td>
//                             <td>${r.ewayBills}</td>
//                             <td>${r.maskAdding}</td>
//                             <td>${r.notes || '-'}</td>
//                         </tr>
//                     `).join('')}

//                 </tbody>

//             </table>

//         </div>

//     `);
// }


// /* =========================
//    ADMIN DASHBOARD
// ========================= */

// async function admin() {

//     const emps = await api('/api/employees');

//     let selected = emps[0]?._id || '';

//     layout(`

//         <!-- SUMMARY -->

//         <div class="grid">

//             <div class="card stat">
//                 Employees
//                 <b>${emps.length}</b>
//             </div>

//             <div class="card stat">
//                 Status
//                 <b>Active</b>
//             </div>

//         </div>

//         <br>


//         <!-- EMPLOYEE MANAGEMENT -->

//         <div class="card">

//             <h2>Employee Management</h2>

//             <p class="muted">
//                 Add employees who need access to the warehouse report system.
//             </p>

//             <div id="employeeMsg"></div>

//             <div class="formgrid">

//                 <div class="field">
//                     <label>Employee Name</label>
//                     <input
//                         id="newEmployeeName"
//                         type="text"
//                         placeholder="Enter employee name"
//                     >
//                 </div>

//                 <div class="field">
//                     <label>Employee Email</label>
//                     <input
//                         id="newEmployeeEmail"
//                         type="email"
//                         placeholder="employee@company.com"
//                     >
//                 </div>

//                 <div class="field">
//                     <label>Employee Password</label>
//                     <input
//                         id="newEmployeePassword"
//                         type="password"
//                         placeholder="Create password"
//                     >
//                 </div>

//             </div>

//             <br>

//             <button
//                 class="btn primary"
//                 onclick="addEmployee()"
//             >
//                 + Add Employee
//             </button>

//         </div>

//         <br>


//         <!-- EMPLOYEE LIST -->

//         <div class="card">

//             <h2>Employees</h2>

//             ${
//                 emps.length === 0
//                     ? `<p class="muted">No employees added yet.</p>`
//                     : `
//                     <table>

//                         <thead>
//                             <tr>
//                                 <th>Name</th>
//                                 <th>Email</th>
//                                 <th>Role</th>
//                             </tr>
//                         </thead>

//                         <tbody>

//                             ${emps.map(e => `
//                                 <tr>
//                                     <td>${e.name}</td>
//                                     <td>${e.email}</td>
//                                     <td>
//                                         <span class="pill">
//                                             Employee
//                                         </span>
//                                     </td>
//                                 </tr>
//                             `).join('')}

//                         </tbody>

//                     </table>
//                     `
//             }

//         </div>

//         <br>


//         <!-- DAILY REPORT -->

//         <div class="card">

//             <h2>Add / Update Daily Data</h2>

//             <div id="msg"></div>

//             ${
//                 emps.length === 0
//                     ? `
//                     <div class="error">
//                         Please add an employee first.
//                     </div>
//                     `
//                     : `
//                     <div class="formgrid">

//                         <div class="field">

//                             <label>Employee</label>

//                             <select id="emp">

//                                 ${emps.map(e => `
//                                     <option value="${e._id}">
//                                         ${e.name} — ${e.email}
//                                     </option>
//                                 `).join('')}

//                             </select>

//                         </div>


//                         <div class="field">

//                             <label>Date</label>

//                             <input
//                                 id="date"
//                                 type="date"
//                                 value="${new Date()
//                                     .toISOString()
//                                     .slice(0, 10)}"
//                             >

//                         </div>


//                         <div class="field">

//                             <label>No. of Scanned</label>

//                             <input
//                                 id="scanned"
//                                 type="number"
//                                 min="0"
//                                 value="0"
//                             >

//                         </div>


//                         <div class="field">

//                             <label>No. of Billed</label>

//                             <input
//                                 id="billed"
//                                 type="number"
//                                 min="0"
//                                 value="0"
//                             >

//                         </div>


//                         <div class="field">

//                             <label>No. of E-Way Bills</label>

//                             <input
//                                 id="ewayBills"
//                                 type="number"
//                                 min="0"
//                                 value="0"
//                             >

//                         </div>


//                         <div class="field">

//                             <label>Mask Adding</label>

//                             <input
//                                 id="maskAdding"
//                                 type="number"
//                                 min="0"
//                                 value="0"
//                             >

//                         </div>


//                         <div
//                             class="field"
//                             style="grid-column:1/-1"
//                         >

//                             <label>Notes</label>

//                             <textarea
//                                 id="notes"
//                                 rows="3"
//                                 placeholder="Any important work or pending item"
//                             ></textarea>

//                         </div>

//                     </div>

//                     <br>

//                     <button
//                         class="btn primary"
//                         onclick="saveReport()"
//                     >
//                         Save / Update
//                     </button>
//                     `
//             }

//         </div>

//         <br>


//         <!-- REPORTS -->

//         <div class="card">

//             <h2>Employee Daily Reports</h2>

//             ${
//                 emps.length === 0
//                     ? `<p class="muted">
//                         Add an employee to view reports.
//                        </p>`
//                     : `

//                     <div class="row">

//                         <select
//                             id="filter"
//                             onchange="loadAdminReports()"
//                         >

//                             ${emps.map(e => `
//                                 <option value="${e._id}">
//                                     ${e.name}
//                                 </option>
//                             `).join('')}

//                         </select>

//                     </div>

//                     <br>

//                     <table>

//                         <thead>

//                             <tr>
//                                 <th>Date</th>
//                                 <th>Employee</th>
//                                 <th>Scanned</th>
//                                 <th>Billed</th>
//                                 <th>E-Way</th>
//                                 <th>Mask</th>
//                                 <th>Notes</th>
//                             </tr>

//                         </thead>

//                         <tbody id="reportRows"></tbody>

//                     </table>

//                     `
//             }

//         </div>

//     `);


//     if (emps.length > 0) {

//         document.getElementById('filter').value = selected;

//         await loadAdminReports();

//     }

// }


// /* =========================
//    ADD EMPLOYEE
// ========================= */

// async function addEmployee() {

//     const name =
//         document.getElementById('newEmployeeName').value.trim();

//     const email =
//         document.getElementById('newEmployeeEmail').value.trim();

//     const password =
//         document.getElementById('newEmployeePassword').value;


//     const msg =
//         document.getElementById('employeeMsg');


//     if (!name || !email || !password) {

//         msg.innerHTML = `
//             <div class="error">
//                 Please fill in name, email and password.
//             </div>
//         `;

//         return;
//     }


//     if (password.length < 6) {

//         msg.innerHTML = `
//             <div class="error">
//                 Password must contain at least 6 characters.
//             </div>
//         `;

//         return;
//     }


//     try {

//         await api('/api/employees', {

//             method: 'POST',

//             body: {
//                 name,
//                 email,
//                 password
//             }

//         });


//         msg.innerHTML = `
//             <div class="notice">
//                 Employee added successfully.
//             </div>
//         `;


//         document.getElementById('newEmployeeName').value = '';
//         document.getElementById('newEmployeeEmail').value = '';
//         document.getElementById('newEmployeePassword').value = '';


//         /*
//          * Re-render admin dashboard.
//          * The new employee will now appear
//          * in the employee dropdown.
//          */

//         await admin();


//     } catch (e) {

//         msg.innerHTML = `
//             <div class="error">
//                 ${e.message}
//             </div>
//         `;

//     }

// }


// /* =========================
//    LOAD ADMIN REPORTS
// ========================= */

// async function loadAdminReports() {

//     const filter =
//         document.getElementById('filter');

//     const reportRows =
//         document.getElementById('reportRows');


//     if (!filter || !reportRows) {
//         return;
//     }


//     const id = filter.value;


//     if (!id) {

//         reportRows.innerHTML = `
//             <tr>
//                 <td colspan="7">
//                     No employee selected.
//                 </td>
//             </tr>
//         `;

//         return;
//     }


//     const rows =
//         await api('/api/reports?employeeId=' + id);


//     reportRows.innerHTML = rows.map(r => `

//         <tr>

//             <td>${r.date}</td>

//             <td>
//                 ${r.employeeId?.name || ''}
//             </td>

//             <td>${r.scanned}</td>

//             <td>${r.billed}</td>

//             <td>${r.ewayBills}</td>

//             <td>${r.maskAdding}</td>

//             <td>${r.notes || '-'}</td>

//         </tr>

//     `).join('');

// }


// /* =========================
//    SAVE / UPDATE REPORT
// ========================= */

// async function saveReport() {

//     try {

//         await api('/api/reports', {

//             method: 'POST',

//             body: {

//                 employeeId:
//                     document.getElementById('emp').value,

//                 date:
//                     document.getElementById('date').value,

//                 scanned:
//                     document.getElementById('scanned').value,

//                 billed:
//                     document.getElementById('billed').value,

//                 ewayBills:
//                     document.getElementById('ewayBills').value,

//                 maskAdding:
//                     document.getElementById('maskAdding').value,

//                 notes:
//                     document.getElementById('notes').value

//             }

//         });


//         document.getElementById('msg').innerHTML = `
//             <div class="notice">
//                 Saved successfully.
//                 Employee dashboards update automatically.
//             </div>
//         `;


//         await loadAdminReports();


//     } catch (e) {

//         document.getElementById('msg').innerHTML = `
//             <div class="error">
//                 ${e.message}
//             </div>
//         `;

//     }

// }


// /* =========================
//    RENDER
// ========================= */

// function render() {

//     if (me.role === 'admin') {

//         admin();

//     } else {

//         employee();

//     }

// }


// /* =========================
//    START APPLICATION
// ========================= */

// if (token && me) {

//     render();

// } else {

//     loginView();

// }


// /* =========================
//    REAL-TIME UPDATES
// ========================= */

// if (token) {

//     const socket = io();

//     socket.on('report:changed', () => {

//         if (me.role === 'admin') {

//             loadAdminReports();

//         } else {

//             employee();

//         }

//     });

// }




// const app = document.getElementById('app');

// let token = localStorage.getItem('token');
// let me = JSON.parse(localStorage.getItem('me') || 'null');

// let reportCache = [];
// let editingReportId = null;


// /* =========================
//    API HELPER
// ========================= */

// const api = async (url, opt = {}) => {

//     opt.headers = {
//         ...(opt.headers || {}),
//         ...(token ? {
//             Authorization: 'Bearer ' + token
//         } : {})
//     };

//     if (opt.body && typeof opt.body !== 'string') {
//         opt.headers['Content-Type'] = 'application/json';
//         opt.body = JSON.stringify(opt.body);
//     }

//     const r = await fetch(url, opt);

//     const d = await r.json().catch(() => ({}));

//     if (!r.ok) {
//         throw Error(d.message || 'Request failed');
//     }

//     return d;
// };


// /* =========================
//    LOGOUT
// ========================= */

// function logout() {

//     localStorage.clear();

//     location.reload();
// }


// /* =========================
//    LOGIN
// ========================= */

// function loginView() {

//     app.innerHTML = `
//         <div class="shell">

//             <div class="card login">

//                 <div class="brand">
//                     Warehouse Work Report
//                 </div>

//                 <p class="muted">
//                     Login to view your warehouse work data.
//                 </p>

//                 <div id="err"></div>

//                 <div class="field">

//                     <label>Email</label>

//                     <input
//                         id="email"
//                         type="email"
//                         placeholder="you@company.com"
//                     >

//                 </div>

//                 <br>

//                 <div class="field">

//                     <label>Password</label>

//                     <input
//                         id="password"
//                         type="password"
//                         placeholder="••••••••"
//                     >

//                 </div>

//                 <br>

//                 <button
//                     class="btn primary"
//                     onclick="doLogin()"
//                 >
//                     Login
//                 </button>

//             </div>

//         </div>
//     `;
// }


// async function doLogin() {

//     try {

//         const d = await api('/api/auth/login', {

//             method: 'POST',

//             body: {
//                 email: document.getElementById('email').value,
//                 password: document.getElementById('password').value
//             }

//         });

//         token = d.token;

//         me = d.user;

//         localStorage.setItem('token', token);

//         localStorage.setItem(
//             'me',
//             JSON.stringify(me)
//         );

//         render();

//     } catch (e) {

//         document.getElementById('err').innerHTML = `
//             <div class="error">
//                 ${e.message}
//             </div>
//         `;

//     }
// }


// /* =========================
//    COMMON LAYOUT
// ========================= */

// function layout(content) {

//     app.innerHTML = `

//         <div class="shell">

//             <div class="top">

//                 <div>

//                     <div class="brand">
//                         Warehouse Work Report
//                     </div>

//                     <div class="muted">

//                         ${
//                             me.role === 'admin'
//                                 ? 'Admin Dashboard'
//                                 : 'Employee Dashboard'
//                         }

//                     </div>

//                 </div>


//                 <div class="row">

//                     <span class="pill">
//                         ${me.name}
//                     </span>

//                     <button
//                         class="btn"
//                         onclick="logout()"
//                     >
//                         Logout
//                     </button>

//                 </div>

//             </div>


//             ${content}

//         </div>

//     `;
// }


// /* =========================
//    EMPLOYEE DASHBOARD
// ========================= */

// async function employee() {

//     const rows = await api('/api/reports');

//     const total = key =>

//         rows.reduce(
//             (s, r) => s + (Number(r[key]) || 0),
//             0
//         );


//     layout(`

//         <div class="grid">

//             <div class="card stat">

//                 Scanned

//                 <b>
//                     ${total('scanned')}
//                 </b>

//             </div>


//             <div class="card stat">

//                 Billed

//                 <b>
//                     ${total('billed')}
//                 </b>

//             </div>


//             <div class="card stat">

//                 E-Way Bills

//                 <b>
//                     ${total('ewayBills')}
//                 </b>

//             </div>


//             <div class="card stat">

//                 Mask Adding

//                 <b>
//                     ${total('maskAdding')}
//                 </b>

//             </div>

//         </div>


//         <br>


//         <div class="card">

//             <h2>
//                 My Daily Work
//             </h2>


//             <div style="overflow-x:auto">

//                 <table>

//                     <thead>

//                         <tr>

//                             <th>Date</th>

//                             <th>Scanned</th>

//                             <th>Billed</th>

//                             <th>E-Way Bills</th>

//                             <th>Mask Adding</th>

//                             <th>Notes</th>

//                         </tr>

//                     </thead>


//                     <tbody>

//                         ${
//                             rows.length === 0

//                             ? `
//                                 <tr>
//                                     <td colspan="6">
//                                         No reports available.
//                                     </td>
//                                 </tr>
//                             `

//                             : rows.map(r => `

//                                 <tr>

//                                     <td>
//                                         ${r.date}
//                                     </td>

//                                     <td>
//                                         ${r.scanned}
//                                     </td>

//                                     <td>
//                                         ${r.billed}
//                                     </td>

//                                     <td>
//                                         ${r.ewayBills}
//                                     </td>

//                                     <td>
//                                         ${r.maskAdding}
//                                     </td>

//                                     <td>
//                                         ${r.notes || '-'}
//                                     </td>

//                                 </tr>

//                             `).join('')
//                         }

//                     </tbody>

//                 </table>

//             </div>

//         </div>

//     `);
// }


// /* =========================
//    ADMIN DASHBOARD
// ========================= */

// async function admin() {

//     const emps = await api('/api/employees');

//     const selected = emps[0]?._id || '';


//     layout(`


//         <!-- SUMMARY -->

//         <div class="grid">

//             <div class="card stat">

//                 Employees

//                 <b>
//                     ${emps.length}
//                 </b>

//             </div>


//             <div class="card stat">

//                 Status

//                 <b>
//                     Active
//                 </b>

//             </div>

//         </div>


//         <br>


//         <!-- EMPLOYEE MANAGEMENT -->

//         <div class="card">

//             <h2>
//                 Employee Management
//             </h2>

//             <p class="muted">
//                 Add employees who need access to the warehouse report system.
//             </p>


//             <div id="employeeMsg"></div>


//             <div class="formgrid">


//                 <div class="field">

//                     <label>
//                         Employee Name
//                     </label>

//                     <input
//                         id="newEmployeeName"
//                         type="text"
//                         placeholder="Enter employee name"
//                     >

//                 </div>


//                 <div class="field">

//                     <label>
//                         Employee Email
//                     </label>

//                     <input
//                         id="newEmployeeEmail"
//                         type="email"
//                         placeholder="employee@company.com"
//                     >

//                 </div>


//                 <div class="field">

//                     <label>
//                         Employee Password
//                     </label>

//                     <input
//                         id="newEmployeePassword"
//                         type="password"
//                         placeholder="Create password"
//                     >

//                 </div>


//             </div>


//             <br>


//             <button
//                 class="btn primary"
//                 onclick="addEmployee()"
//             >
//                 + Add Employee
//             </button>


//         </div>


//         <br>


//         <!-- EMPLOYEE LIST -->

//         <div class="card">

//             <h2>
//                 Employees
//             </h2>


//             ${
//                 emps.length === 0

//                 ? `
//                     <p class="muted">
//                         No employees added yet.
//                     </p>
//                 `

//                 : `

//                     <div style="overflow-x:auto">

//                         <table>

//                             <thead>

//                                 <tr>

//                                     <th>
//                                         Name
//                                     </th>

//                                     <th>
//                                         Email
//                                     </th>

//                                     <th>
//                                         Role
//                                     </th>

//                                 </tr>

//                             </thead>


//                             <tbody>

//                                 ${
//                                     emps.map(e => `

//                                         <tr>

//                                             <td>
//                                                 ${e.name}
//                                             </td>

//                                             <td>
//                                                 ${e.email}
//                                             </td>

//                                             <td>

//                                                 <span class="pill">
//                                                     Employee
//                                                 </span>

//                                             </td>

//                                         </tr>

//                                     `).join('')
//                                 }

//                             </tbody>

//                         </table>

//                     </div>

//                 `
//             }

//         </div>


//         <br>


//         <!-- DAILY REPORT -->

//         <div class="card">

//             <h2>

//                 ${
//                     editingReportId
//                         ? 'Update Daily Data'
//                         : 'Add / Update Daily Data'
//                 }

//             </h2>


//             <div id="msg"></div>


//             ${
//                 emps.length === 0

//                 ? `

//                     <div class="error">
//                         Please add an employee first.
//                     </div>

//                 `

//                 : `

//                     <div class="formgrid">


//                         <!-- EMPLOYEE -->

//                         <div class="field">

//                             <label>
//                                 Employee
//                             </label>

//                             <select
//                                 id="emp"
//                                 ${
//                                     editingReportId
//                                         ? 'disabled'
//                                         : ''
//                                 }
//                             >

//                                 ${
//                                     emps.map(e => `

//                                         <option
//                                             value="${e._id}"
//                                         >

//                                             ${e.name}
//                                             — ${e.email}

//                                         </option>

//                                     `).join('')
//                                 }

//                             </select>

//                         </div>


//                         <!-- DATE -->

//                         <div class="field">

//                             <label>
//                                 Date
//                             </label>

//                             <input
//                                 id="date"
//                                 type="date"
//                                 ${
//                                     editingReportId
//                                         ? 'disabled'
//                                         : ''
//                                 }
//                                 value="${new Date()
//                                     .toISOString()
//                                     .slice(0, 10)}"
//                             >

//                         </div>


//                         <!-- SCANNED -->

//                         <div class="field">

//                             <label>
//                                 No. of Scanned
//                             </label>

//                             <input
//                                 id="scanned"
//                                 type="number"
//                                 min="0"
//                                 value="0"
//                             >

//                         </div>


//                         <!-- BILLED -->

//                         <div class="field">

//                             <label>
//                                 No. of Billed
//                             </label>

//                             <input
//                                 id="billed"
//                                 type="number"
//                                 min="0"
//                                 value="0"
//                             >

//                         </div>


//                         <!-- EWAY -->

//                         <div class="field">

//                             <label>
//                                 No. of E-Way Bills
//                             </label>

//                             <input
//                                 id="ewayBills"
//                                 type="number"
//                                 min="0"
//                                 value="0"
//                             >

//                         </div>


//                         <!-- MASK -->

//                         <div class="field">

//                             <label>
//                                 Mask Adding
//                             </label>

//                             <input
//                                 id="maskAdding"
//                                 type="number"
//                                 min="0"
//                                 value="0"
//                             >

//                         </div>


//                         <!-- NOTES -->

//                         <div
//                             class="field"
//                             style="grid-column:1/-1"
//                         >

//                             <label>
//                                 Notes
//                             </label>

//                             <textarea
//                                 id="notes"
//                                 rows="3"
//                                 placeholder="Any important work or pending item"
//                             ></textarea>

//                         </div>


//                     </div>


//                     <br>


//                     <button
//                         class="btn primary"
//                         onclick="saveReport()"
//                     >

//                         ${
//                             editingReportId
//                                 ? 'Update Report'
//                                 : 'Save / Update'
//                         }

//                     </button>


//                     ${
//                         editingReportId

//                         ? `

//                             <button
//                                 class="btn"
//                                 onclick="cancelEdit()"
//                                 style="margin-left:8px"
//                             >
//                                 Cancel Edit
//                             </button>

//                         `

//                         : ''
//                     }

//                 `
//             }

//         </div>


//         <br>


//         <!-- REPORTS -->

//         <div class="card">

//             <h2>
//                 Employee Daily Reports
//             </h2>


//             ${
//                 emps.length === 0

//                 ? `

//                     <p class="muted">
//                         Add an employee to view reports.
//                     </p>

//                 `

//                 : `

//                     <div class="row">

//                         <select
//                             id="filter"
//                             onchange="loadAdminReports()"
//                         >

//                             ${
//                                 emps.map(e => `

//                                     <option
//                                         value="${e._id}"
//                                     >
//                                         ${e.name}
//                                     </option>

//                                 `).join('')
//                             }

//                         </select>

//                     </div>


//                     <br>


//                     <div style="overflow-x:auto">

//                         <table>

//                             <thead>

//                                 <tr>

//                                     <th>
//                                         Date
//                                     </th>

//                                     <th>
//                                         Employee
//                                     </th>

//                                     <th>
//                                         Scanned
//                                     </th>

//                                     <th>
//                                         Billed
//                                     </th>

//                                     <th>
//                                         E-Way
//                                     </th>

//                                     <th>
//                                         Mask
//                                     </th>

//                                     <th>
//                                         Notes
//                                     </th>

//                                     <th>
//                                         Actions
//                                     </th>

//                                 </tr>

//                             </thead>


//                             <tbody id="reportRows">

//                             </tbody>

//                         </table>

//                     </div>

//                 `
//             }

//         </div>

//     `);


//     if (emps.length > 0) {

//         document.getElementById('filter').value =
//             selected;

//         await loadAdminReports();

//     }

// }


// /* =========================
//    ADD EMPLOYEE
// ========================= */

// async function addEmployee() {

//     const name =
//         document
//             .getElementById('newEmployeeName')
//             .value
//             .trim();


//     const email =
//         document
//             .getElementById('newEmployeeEmail')
//             .value
//             .trim();


//     const password =
//         document
//             .getElementById('newEmployeePassword')
//             .value;


//     const msg =
//         document.getElementById('employeeMsg');


//     if (!name || !email || !password) {

//         msg.innerHTML = `

//             <div class="error">
//                 Please fill in name, email and password.
//             </div>

//         `;

//         return;
//     }


//     if (password.length < 6) {

//         msg.innerHTML = `

//             <div class="error">
//                 Password must contain at least 6 characters.
//             </div>

//         `;

//         return;
//     }


//     try {

//         await api('/api/employees', {

//             method: 'POST',

//             body: {
//                 name,
//                 email,
//                 password
//             }

//         });


//         editingReportId = null;


//         /*
//          * Re-render the admin dashboard.
//          */

//         await admin();


//     } catch (e) {

//         msg.innerHTML = `

//             <div class="error">
//                 ${e.message}
//             </div>

//         `;

//     }

// }


// /* =========================
//    LOAD ADMIN REPORTS
// ========================= */

// async function loadAdminReports() {

//     const filter =
//         document.getElementById('filter');


//     const reportRows =
//         document.getElementById('reportRows');


//     if (!filter || !reportRows) {
//         return;
//     }


//     const id =
//         filter.value;


//     if (!id) {

//         reportRows.innerHTML = `

//             <tr>

//                 <td colspan="8">
//                     No employee selected.
//                 </td>

//             </tr>

//         `;

//         return;
//     }


//     try {

//         const rows =
//             await api(
//                 '/api/reports?employeeId=' + id
//             );


//         reportCache = rows;


//         if (rows.length === 0) {

//             reportRows.innerHTML = `

//                 <tr>

//                     <td colspan="8">

//                         No reports found for this employee.

//                     </td>

//                 </tr>

//             `;

//             return;
//         }


//         reportRows.innerHTML = rows.map(r => `

//             <tr>

//                 <td>
//                     ${r.date}
//                 </td>


//                 <td>
//                     ${r.employeeId?.name || ''}
//                 </td>


//                 <td>
//                     ${r.scanned}
//                 </td>


//                 <td>
//                     ${r.billed}
//                 </td>


//                 <td>
//                     ${r.ewayBills}
//                 </td>


//                 <td>
//                     ${r.maskAdding}
//                 </td>


//                 <td>
//                     ${r.notes || '-'}
//                 </td>


//                 <td>

//                     <div
//                         style="
//                             display:flex;
//                             gap:6px;
//                             white-space:nowrap;
//                         "
//                     >

//                         <button
//                             class="btn"
//                             onclick="editReport('${r._id}')"
//                             style="
//                                 padding:7px 10px;
//                                 font-size:13px;
//                             "
//                         >
//                             ✏️ Update
//                         </button>


//                         <button
//                             class="btn"
//                             onclick="deleteReport('${r._id}')"
//                             style="
//                                 padding:7px 10px;
//                                 font-size:13px;
//                                 background:#ffe8e8;
//                                 color:#c62828;
//                                 border:1px solid #ffcaca;
//                             "
//                         >
//                             🗑️ Delete
//                         </button>

//                     </div>

//                 </td>

//             </tr>

//         `).join('');


//     } catch (e) {

//         reportRows.innerHTML = `

//             <tr>

//                 <td colspan="8">

//                     ${e.message}

//                 </td>

//             </tr>

//         `;

//     }

// }


// /* =========================
//    EDIT REPORT
// ========================= */

// function editReport(id) {

//     const report =
//         reportCache.find(
//             r => r._id === id
//         );


//     if (!report) {

//         alert('Report not found.');

//         return;
//     }


//     editingReportId = id;


//     /*
//      * Re-render the admin page so
//      * Employee and Date become locked.
//      */

//     admin().then(() => {

//         const emp =
//             document.getElementById('emp');

//         const date =
//             document.getElementById('date');

//         const scanned =
//             document.getElementById('scanned');

//         const billed =
//             document.getElementById('billed');

//         const ewayBills =
//             document.getElementById('ewayBills');

//         const maskAdding =
//             document.getElementById('maskAdding');

//         const notes =
//             document.getElementById('notes');


//         if (emp) {

//             emp.value =
//                 report.employeeId?._id ||
//                 report.employeeId;

//         }


//         if (date) {

//             date.value =
//                 report.date;

//         }


//         if (scanned) {

//             scanned.value =
//                 report.scanned;

//         }


//         if (billed) {

//             billed.value =
//                 report.billed;

//         }


//         if (ewayBills) {

//             ewayBills.value =
//                 report.ewayBills;

//         }


//         if (maskAdding) {

//             maskAdding.value =
//                 report.maskAdding;

//         }


//         if (notes) {

//             notes.value =
//                 report.notes || '';

//         }


//         const msg =
//             document.getElementById('msg');


//         if (msg) {

//             msg.innerHTML = `

//                 <div class="notice">

//                     Editing report for
//                     <strong>${report.date}</strong>.

//                     Change the work numbers and click
//                     <strong>Update Report</strong>.

//                 </div>

//             `;

//         }


//         window.scrollTo({
//             top: 0,
//             behavior: 'smooth'
//         });

//     });

// }


// /* =========================
//    CANCEL EDIT
// ========================= */

// function cancelEdit() {

//     editingReportId = null;

//     admin();

// }


// /* =========================
//    DELETE REPORT
// ========================= */

// async function deleteReport(id) {

//     const report =
//         reportCache.find(
//             r => r._id === id
//         );


//     if (!report) {

//         alert('Report not found.');

//         return;
//     }


//     const employeeName =
//         report.employeeId?.name ||
//         'Employee';


//     const confirmed =
//         confirm(
//             `Are you sure you want to delete the report for ${employeeName} on ${report.date}?`
//         );


//     if (!confirmed) {
//         return;
//     }


//     try {

//         await api(
//             '/api/reports/' + id,
//             {
//                 method: 'DELETE'
//             }
//         );


//         editingReportId = null;


//         const msg =
//             document.getElementById('msg');


//         if (msg) {

//             msg.innerHTML = `

//                 <div class="notice">

//                     Report deleted successfully.

//                 </div>

//             `;

//         }


//         await loadAdminReports();


//     } catch (e) {

//         const msg =
//             document.getElementById('msg');


//         if (msg) {

//             msg.innerHTML = `

//                 <div class="error">

//                     ${e.message}

//                 </div>

//             `;

//         } else {

//             alert(e.message);

//         }

//     }

// }


// /* =========================
//    SAVE / UPDATE REPORT
// ========================= */

// async function saveReport() {

//     try {

//         const employeeId =
//             document
//                 .getElementById('emp')
//                 .value;


//         const date =
//             document
//                 .getElementById('date')
//                 .value;


//         const scanned =
//             document
//                 .getElementById('scanned')
//                 .value;


//         const billed =
//             document
//                 .getElementById('billed')
//                 .value;


//         const ewayBills =
//             document
//                 .getElementById('ewayBills')
//                 .value;


//         const maskAdding =
//             document
//                 .getElementById('maskAdding')
//                 .value;


//         const notes =
//             document
//                 .getElementById('notes')
//                 .value;


//         await api('/api/reports', {

//             method: 'POST',

//             body: {

//                 employeeId,

//                 date,

//                 scanned,

//                 billed,

//                 ewayBills,

//                 maskAdding,

//                 notes

//             }

//         });


//         editingReportId = null;


//         const msg =
//             document.getElementById('msg');


//         if (msg) {

//             msg.innerHTML = `

//                 <div class="notice">

//                     ${
//                         editingReportId
//                             ? 'Report updated successfully.'
//                             : 'Report saved successfully.'
//                     }

//                     Employee dashboard updates automatically.

//                 </div>

//             `;

//         }


//         /*
//          * Re-render the admin page so the
//          * form returns to normal mode.
//          */

//         await admin();


//     } catch (e) {

//         const msg =
//             document.getElementById('msg');


//         if (msg) {

//             msg.innerHTML = `

//                 <div class="error">

//                     ${e.message}

//                 </div>

//             `;

//         } else {

//             alert(e.message);

//         }

//     }

// }


// /* =========================
//    RENDER
// ========================= */

// function render() {

//     if (me.role === 'admin') {

//         admin();

//     } else {

//         employee();

//     }

// }


// /* =========================
//    START APPLICATION
// ========================= */

// if (token && me) {

//     render();

// } else {

//     loginView();

// }


// /* =========================
//    REAL-TIME UPDATES
// ========================= */

// if (token) {

//     const socket = io();


//     socket.on(
//         'report:changed',
//         () => {

//             if (me.role === 'admin') {

//                 loadAdminReports();

//             } else {

//                 employee();

//             }

//         }
//     );

// }


const app = document.getElementById('app');

let token = localStorage.getItem('token');
let me = JSON.parse(localStorage.getItem('me') || 'null');

let reportCache = [];
let editingReportId = null;
let selectedAdminEmployee = null;


/* =========================
   API HELPER
========================= */

const api = async (url, opt = {}) => {

    opt.headers = {
        ...(opt.headers || {}),
        ...(token ? {
            Authorization: 'Bearer ' + token
        } : {})
    };

    if (opt.body && typeof opt.body !== 'string') {
        opt.headers['Content-Type'] = 'application/json';
        opt.body = JSON.stringify(opt.body);
    }

    const r = await fetch(url, opt);

    const d = await r.json().catch(() => ({}));

    if (!r.ok) {
        throw Error(d.message || 'Request failed');
    }

    return d;
};


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.clear();

    location.reload();
}


/* =========================
   LOGIN
========================= */

function loginView() {

    app.innerHTML = `
        <div class="shell">

            <div class="card login">

                <div class="brand">
                    Warehouse Work Report
                </div>

                <p class="muted">
                    Login to view your warehouse work data.
                </p>

                <div id="err"></div>

                <div class="field">

                    <label>Email</label>

                    <input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                    >

                </div>

                <br>

                <div class="field">

                    <label>Password</label>

                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                    >

                </div>

                <br>

                <button
                    class="btn primary"
                    onclick="doLogin()"
                >
                    Login
                </button>

            </div>

        </div>
    `;
}


async function doLogin() {

    try {

        const d = await api('/api/auth/login', {

            method: 'POST',

            body: {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            }

        });

        token = d.token;

        me = d.user;

        localStorage.setItem('token', token);

        localStorage.setItem(
            'me',
            JSON.stringify(me)
        );

        render();

    } catch (e) {

        document.getElementById('err').innerHTML = `
            <div class="error">
                ${e.message}
            </div>
        `;

    }
}


/* =========================
   COMMON LAYOUT
========================= */

function layout(content) {

    app.innerHTML = `

        <div class="shell">

            <div class="top">

                <div>

                    <div class="brand">
                        Warehouse Work Report
                    </div>

                    <div class="muted">

                        ${
                            me.role === 'admin'
                                ? 'Admin Dashboard'
                                : 'Employee Dashboard'
                        }

                    </div>

                </div>


                <div class="row">

                    <span class="pill">
                        ${me.name}
                    </span>

                    <button
                        class="btn"
                        onclick="logout()"
                    >
                        Logout
                    </button>

                </div>

            </div>


            ${content}

        </div>

    `;
}


/* =========================
   FORMAT DATE FOR GRAPH
========================= */

function formatGraphDate(dateString) {

    if (!dateString) {
        return '';
    }

    const parts = dateString.split('-');

    if (parts.length !== 3) {
        return dateString;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);

    const date = new Date(
        year,
        month,
        day
    );

    return date.toLocaleDateString(
        'en-IN',
        {
            day: '2-digit',
            month: 'short'
        }
    );
}


/* =========================
   EMPLOYEE PERFORMANCE GRAPH
========================= */

function createPerformanceGraph(rows) {

    if (!rows || rows.length === 0) {

        return `
            <div class="card">

                <h2>
                    📊 My Performance
                </h2>

                <p class="muted">
                    No daily report data available yet.
                </p>

            </div>
        `;
    }


    /*
     * Sort reports by date.
     */

    const sortedRows = [...rows].sort(
        (a, b) =>
            new Date(a.date) -
            new Date(b.date)
    );


    /*
     * Show only the latest 7 days.
     */

    const lastSeven =
        sortedRows.slice(-7);


    /*
     * Find maximum value so the
     * bars can be scaled.
     */

    let maxValue = 0;


    lastSeven.forEach(r => {

        maxValue = Math.max(

            maxValue,

            Number(r.scanned) || 0,

            Number(r.billed) || 0,

            Number(r.ewayBills) || 0,

            Number(r.maskAdding) || 0,

            Number(r.trackScan) || 0

        );

    });


    if (maxValue === 0) {
        maxValue = 1;
    }


    /*
     * Graph height.
     */

    const graphHeight = 260;


    /*
     * Create one group for each day.
     */

    const dayGroups = lastSeven.map(r => {

        const scanned =
            Number(r.scanned) || 0;

        const billed =
            Number(r.billed) || 0;

        const eway =
            Number(r.ewayBills) || 0;

        const mask =
            Number(r.maskAdding) || 0;

        const trackScan =
            Number(r.trackScan) || 0;


        const scannedHeight =
            Math.max(
                scanned === 0
                    ? 0
                    : (scanned / maxValue) * graphHeight,
                scanned === 0 ? 0 : 4
            );


        const billedHeight =
            Math.max(
                billed === 0
                    ? 0
                    : (billed / maxValue) * graphHeight,
                billed === 0 ? 0 : 4
            );


        const ewayHeight =
            Math.max(
                eway === 0
                    ? 0
                    : (eway / maxValue) * graphHeight,
                eway === 0 ? 0 : 4
            );


        const maskHeight =
            Math.max(
                mask === 0
                    ? 0
                    : (mask / maxValue) * graphHeight,
                mask === 0 ? 0 : 4
            );
        const trackScanHeight =
            Math.max(
                trackScan === 0
                    ? 0
                    : (trackScan / maxValue) * graphHeight,
                trackScan === 0 ? 0 : 4
            );

        return `

            <div
                class="graph-day"
                title="${r.date}"
            >

                <div
                    class="graph-bars"
                    style="
                        height:${graphHeight}px;
                        align-items:flex-end;
                    "
                >

                    <!-- SCANNED -->

                    <div
                        class="graph-bar scanned-bar"
                        style="
                            height:${scannedHeight}px;
                        "
                    >
                        <span>
                            ${scanned}
                        </span>
                    </div>


                    <!-- BILLED -->

                    <div
                        class="graph-bar billed-bar"
                        style="
                            height:${billedHeight}px;
                        "
                    >
                        <span>
                            ${billed}
                        </span>
                    </div>


                    <!-- E-WAY -->

                    <div
                        class="graph-bar eway-bar"
                        style="
                            height:${ewayHeight}px;
                        "
                    >
                        <span>
                            ${eway}
                        </span>
                    </div>


                    <!-- MASK -->

                    <div
                        class="graph-bar mask-bar"
                        style="
                            height:${maskHeight}px;
                        "
                    >
                        <span>
                            ${mask}
                        </span>
                    </div>

                    <!-- TRACK SCAN -->

                    <div
                        class="graph-bar trackscan-bar"
                        style="
                            height:${trackScanHeight}px;
                        "
                    >
                        <span>
                            ${trackScan}
                        </span>
                    </div>

                </div>


                <div class="graph-date">

                    ${formatGraphDate(r.date)}

                </div>

            </div>

        `;

    }).join('');


    return `

        <div class="card performance-card">

            <div class="performance-header">

                <div>

                    <h2>
                        📊 My Performance
                    </h2>

                    <p class="muted">
                        Daily performance for the last 7 reported days
                    </p>

                </div>

            </div>


            <!-- LEGEND -->

            <div class="graph-legend">

                <div class="legend-item">

                    <span
                        class="legend-box scanned-legend"
                    ></span>

                    Scanned

                </div>


                <div class="legend-item">

                    <span
                        class="legend-box billed-legend"
                    ></span>

                    Billed

                </div>


                <div class="legend-item">

                    <span
                        class="legend-box eway-legend"
                    ></span>

                    E-Way

                </div>


                <div class="legend-item">

                    <span
                        class="legend-box mask-legend"
                    ></span>

                    Mask

                </div>

                <div class="legend-item">
                    <span
                        class="legend-box trackscan-legend"
                    ></span>

                    Track Scan
                </div>

            </div>


            <!-- GRAPH -->

            <div class="graph-wrapper">

                <div class="graph-y-axis">

                    <span>${maxValue}</span>

                    <span>
                        ${Math.round(maxValue * 0.75)}
                    </span>

                    <span>
                        ${Math.round(maxValue * 0.50)}
                    </span>

                    <span>
                        ${Math.round(maxValue * 0.25)}
                    </span>

                    <span>0</span>

                </div>


                <div class="graph-area">

                    <div class="graph-grid-lines">

                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>

                    </div>


                    <div class="graph-days">

                        ${dayGroups}

                    </div>

                </div>

            </div>

        </div>

    `;
}


/* =========================
   EMPLOYEE DASHBOARD
========================= */

async function employee() {

    try {

        const rows =
            await api('/api/reports');


        const total = key =>

            rows.reduce(
                (s, r) =>
                    s + (Number(r[key]) || 0),
                0
            );


        layout(`

            <!-- SUMMARY CARDS -->

            <div class="grid">

                <div class="card stat">

                    Scanned

                    <b>
                        ${total('scanned')}
                    </b>

                </div>


                <div class="card stat">

                    Billed

                    <b>
                        ${total('billed')}
                    </b>

                </div>


                <div class="card stat">

                    E-Way Bills

                    <b>
                        ${total('ewayBills')}
                    </b>

                </div>


                <div class="card stat">

                    Mask Adding

                    <b>
                        ${total('maskAdding')}
                    </b>

                </div>

                <div class="card stat">
                    Track Scan
                    <b>
                        ${total('trackScan')}
                    </b>
                </div>

            </div>


            <br>


            <!-- PERFORMANCE GRAPH -->

            ${createPerformanceGraph(rows)}


            <br>


            <!-- DAILY WORK TABLE -->

            <div class="card">

                <h2>
                    My Daily Work
                </h2>


                <div style="overflow-x:auto">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Scanned
                                </th>

                                <th>
                                    Billed
                                </th>

                                <th>
                                    E-Way Bills
                                </th>

                                <th>
                                    Mask Adding
                                </th>

                                <th>
                                    Track Scan
                                </th>

                                <th>
                                    Notes
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${
                                rows.length === 0

                                ? `

                                    <tr>

                                        <td colspan="7">

                                            No reports available.

                                        </td>

                                    </tr>

                                `

                                : rows.map(r => `

                                    <tr>

                                        <td>
                                            ${r.date}
                                        </td>

                                        <td>
                                            ${r.scanned}
                                        </td>

                                        <td>
                                            ${r.billed}
                                        </td>

                                        <td>
                                            ${r.ewayBills}
                                        </td>

                                        <td>
                                            ${r.maskAdding}
                                        </td>

                                        <td>
                                            ${r.trackScan || 0}
                                        </td>

                                        <td>
                                            ${r.notes || '-'}
                                        </td>

                                    </tr>

                                `).join('')
                            }

                        </tbody>

                    </table>

                </div>

            </div>

        `);


        /*
         * Add graph CSS after the page
         * has been rendered.
         */

        addGraphStyles();


    } catch (e) {

        layout(`

            <div class="card">

                <div class="error">
                    ${e.message}
                </div>

            </div>

        `);

    }

}


/* =========================
   GRAPH CSS
========================= */

function addGraphStyles() {

    if (document.getElementById('graphStyles')) {
        return;
    }


    const style =
        document.createElement('style');


    style.id = 'graphStyles';


    style.innerHTML = `

        .performance-card {
            overflow: hidden;
        }


        .performance-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }


        .performance-header h2 {
            margin-bottom: 5px;
        }


        .graph-legend {
            display: flex;
            flex-wrap: wrap;
            gap: 18px;
            margin-bottom: 20px;
        }


        .legend-item {
            display: flex;
            align-items: center;
            gap: 7px;
            font-size: 14px;
            font-weight: 600;
        }


        .legend-box {
            width: 14px;
            height: 14px;
            border-radius: 3px;
            display: inline-block;
        }


        .scanned-legend {
            background: #2563eb;
        }


        .billed-legend {
            background: #16a34a;
        }


        .eway-legend {
            background: #f59e0b;
        }


        .mask-legend {
            background: #9333ea;
        }


        .trackscan-legend {
            background: #dc2626;
        }

        .mask-bar {
            background: #9333ea;
        }             
            
        .trackscan-bar {
            background: #dc2626;
        }


        .graph-wrapper {
            display: flex;
            width: 100%;
            min-height: 310px;
            overflow-x: auto;
        }


        .graph-y-axis {
            width: 45px;
            height: 260px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-end;
            padding-right: 8px;
            font-size: 11px;
            color: #6b7280;
            flex-shrink: 0;
        }


        .graph-area {
            position: relative;
            flex: 1;
            min-width: 500px;
            height: 300px;
        }


        .graph-grid-lines {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            height: 260px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            pointer-events: none;
        }


        .graph-grid-lines div {
            width: 100%;
            border-top: 1px dashed #d9dee7;
        }


        .graph-days {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            height: 300px;
            display: flex;
            justify-content: space-around;
            align-items: flex-start;
        }


        .graph-day {
            flex: 1;
            min-width: 65px;
            max-width: 150px;
            height: 300px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
        }


        .graph-bars {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            gap: 3px;
            position: relative;
            z-index: 2;
        }


        .graph-bar {
            width: 13px;
            min-height: 0;
            border-radius: 4px 4px 0 0;
            position: relative;
            transition: opacity 0.2s ease;
        }


        .graph-bar:hover {
            opacity: 0.75;
        }


        .graph-bar span {
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            font-weight: 700;
            white-space: nowrap;
        }


        .scanned-bar {
            background: #2563eb;
        }


        .billed-bar {
            background: #16a34a;
        }


        .eway-bar {
            background: #f59e0b;
        }


        .mask-bar {
            background: #9333ea;
        }


        .graph-date {
            margin-top: 12px;
            font-size: 12px;
            font-weight: 600;
            color: #374151;
            white-space: nowrap;
        }


        @media (max-width: 700px) {

            .graph-area {
                min-width: 450px;
            }


            .graph-bar {
                width: 10px;
            }


            .graph-bars {
                gap: 2px;
            }

        }

    `;


    document.head.appendChild(style);
}


/* =========================
   ADMIN DASHBOARD
========================= */

async function admin() {

    const emps =
        await api('/api/employees');


    if (
        selectedAdminEmployee &&
        !emps.some(
            e => e._id === selectedAdminEmployee
        )
    ) {

        selectedAdminEmployee =
            null;

    }


    const selected =
        selectedAdminEmployee ||
        emps[0]?._id ||
        '';


    layout(`

        <!-- SUMMARY -->

        <div class="grid">

            <div class="card stat">

                Employees

                <b>
                    ${emps.length}
                </b>

            </div>


            <div class="card stat">

                Status

                <b>
                    Active
                </b>

            </div>

        </div>


        <br>


        <!-- EMPLOYEE MANAGEMENT -->

        <div class="card">

            <h2>
                Employee Management
            </h2>

            <p class="muted">
                Add employees who need access to the warehouse report system.
            </p>


            <div id="employeeMsg"></div>


            <div class="formgrid">

                <div class="field">

                    <label>
                        Employee Name
                    </label>

                    <input
                        id="newEmployeeName"
                        type="text"
                        placeholder="Enter employee name"
                    >

                </div>


                <div class="field">

                    <label>
                        Employee Email
                    </label>

                    <input
                        id="newEmployeeEmail"
                        type="email"
                        placeholder="employee@company.com"
                    >

                </div>


                <div class="field">

                    <label>
                        Employee Password
                    </label>

                    <input
                        id="newEmployeePassword"
                        type="password"
                        placeholder="Create password"
                    >

                </div>

            </div>


            <br>


            <button
                class="btn primary"
                onclick="addEmployee()"
            >
                + Add Employee
            </button>

        </div>


        <br>


        <!-- EMPLOYEE LIST -->

        <div class="card">

            <h2>
                Employees
            </h2>


            ${
                emps.length === 0

                ? `

                    <p class="muted">
                        No employees added yet.
                    </p>

                `

                : `

                    <div style="overflow-x:auto">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Role
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                ${
                                    emps.map(e => `

                                        <tr>

                                            <td>
                                                ${e.name}
                                            </td>

                                            <td>
                                                ${e.email}
                                            </td>

                                            <td>

                                                <span class="pill">
                                                    Employee
                                                </span>

                                            </td>

                                        </tr>

                                    `).join('')
                                }

                            </tbody>

                        </table>

                    </div>

                `

            }

        </div>


        <br>


        <!-- DAILY REPORT -->

        <div class="card">

            <h2>

                ${
                    editingReportId
                        ? 'Update Daily Data'
                        : 'Add / Update Daily Data'
                }

            </h2>


            <div id="msg"></div>


            ${
                emps.length === 0

                ? `

                    <div class="error">
                        Please add an employee first.
                    </div>

                `

                : `

                    <div class="formgrid">


                        <!-- EMPLOYEE -->

                        <div class="field">

                            <label>
                                Employee
                            </label>

                            <select
                                id="emp"
                                ${
                                    editingReportId
                                        ? 'disabled'
                                        : ''
                                }
                            >

                                ${
                                    emps.map(e => `

                                        <option
                                            value="${e._id}"
                                        >

                                            ${e.name}
                                            — ${e.email}

                                        </option>

                                    `).join('')
                                }

                            </select>

                        </div>


                        <!-- DATE -->

                        <div class="field">

                            <label>
                                Date
                            </label>

                            <input
                                id="date"
                                type="date"
                                ${
                                    editingReportId
                                        ? 'disabled'
                                        : ''
                                }
                                value="${new Date()
                                    .toISOString()
                                    .slice(0, 10)}"
                            >

                        </div>


                        <!-- SCANNED -->

                        <div class="field">

                            <label>
                                No. of Scanned
                            </label>

                            <input
                                id="scanned"
                                type="number"
                                min="0"
                                value="0"
                            >

                        </div>


                        <!-- BILLED -->

                        <div class="field">

                            <label>
                                No. of Billed
                            </label>

                            <input
                                id="billed"
                                type="number"
                                min="0"
                                value="0"
                            >

                        </div>
                        <!-- Track Scan -->
                        <div class="field">
                        <label>
                            Track Scan
                            <input type="number" id="trackScan" value="0" min="0">
                            </label>                     
                        </div>
                        <!-- E-WAY -->

                        <div class="field">

                            <label>
                                No. of E-Way Bills
                            </label>

                            <input
                                id="ewayBills"
                                type="number"
                                min="0"
                                value="0"
                            >

                        </div>


                        <!-- MASK -->

                        <div class="field">

                            <label>
                                Mask Adding
                            </label>

                            <input
                                id="maskAdding"
                                type="number"
                                min="0"
                                value="0"
                            >

                        </div>


                        <!-- NOTES -->

                        <div
                            class="field"
                            style="grid-column:1/-1"
                        >

                            <label>
                                Notes
                            </label>

                            <textarea
                                id="notes"
                                rows="3"
                                placeholder="Any important work or pending item"
                            ></textarea>

                        </div>


                    </div>


                    <br>


                    <button
                        class="btn primary"
                        onclick="saveReport()"
                    >

                        ${
                            editingReportId
                                ? 'Update Report'
                                : 'Save / Update'
                        }

                    </button>


                    ${
                        editingReportId

                        ? `

                            <button
                                class="btn"
                                onclick="cancelEdit()"
                                style="margin-left:8px"
                            >
                                Cancel Edit
                            </button>

                        `

                        : ''

                    }

                `
            }

        </div>


        <br>


        <!-- REPORTS -->

        <div class="card">

            <h2>
                Employee Daily Reports
            </h2>


            ${
                emps.length === 0

                ? `

                    <p class="muted">
                        Add an employee to view reports.
                    </p>

                `

                : `

                    <div class="row">

                        <select
                            id="filter"
                            onchange="changeAdminEmployee()"
                        >

                            ${
                                emps.map(e => `

                                    <option
                                        value="${e._id}"
                                    >
                                        ${e.name}
                                    </option>

                                `).join('')
                            }

                        </select>

                    </div>


                    <br>


                    <div style="overflow-x:auto">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Employee
                                    </th>

                                    <th>
                                        Scanned
                                    </th>

                                    <th>
                                        Billed
                                    </th>

                                    <th>
                                        E-Way
                                    </th>

                                    <th>
                                        Mask
                                    </th>

                                    <th>
                                        Track Scan
                                    </th>
                                    <th>
                                        Notes
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody id="reportRows">

                            </tbody>

                        </table>

                    </div>

                `
            }

        </div>

    `);


    if (emps.length > 0) {

        document.getElementById('filter').value =
            selected;


        await loadAdminReports();

    }

}


/* =========================
   CHANGE ADMIN EMPLOYEE
========================= */

async function changeAdminEmployee() {

    const filter =
        document.getElementById('filter');


    if (!filter) {
        return;
    }


    selectedAdminEmployee =
        filter.value;


    editingReportId = null;


    await loadAdminReports();

}


/* =========================
   ADD EMPLOYEE
========================= */

async function addEmployee() {

    const name =
        document
            .getElementById('newEmployeeName')
            .value
            .trim();


    const email =
        document
            .getElementById('newEmployeeEmail')
            .value
            .trim();


    const password =
        document
            .getElementById('newEmployeePassword')
            .value;


    const msg =
        document.getElementById('employeeMsg');


    if (!name || !email || !password) {

        msg.innerHTML = `

            <div class="error">
                Please fill in name, email and password.
            </div>

        `;

        return;
    }


    if (password.length < 6) {

        msg.innerHTML = `

            <div class="error">
                Password must contain at least 6 characters.
            </div>

        `;

        return;
    }


    try {

        await api('/api/employees', {

            method: 'POST',

            body: {
                name,
                email,
                password
            }

        });


        editingReportId = null;


        await admin();


    } catch (e) {

        msg.innerHTML = `

            <div class="error">
                ${e.message}
            </div>

        `;

    }

}


/* =========================
   LOAD ADMIN REPORTS
========================= */

async function loadAdminReports() {

    const filter =
        document.getElementById('filter');


    const reportRows =
        document.getElementById('reportRows');


    if (!filter || !reportRows) {
        return;
    }


    const id =
        filter.value;


    if (!id) {

        reportRows.innerHTML = `

            <tr>

                <td colspan="8">
                    No employee selected.
                </td>

            </tr>

        `;

        return;
    }


    try {

        const rows =
            await api(
                '/api/reports?employeeId=' + id
            );


        reportCache = rows;


        if (rows.length === 0) {

            reportRows.innerHTML = `

                <tr>

                    <td colspan="8">

                        No reports found for this employee.

                    </td>

                </tr>

            `;

            return;
        }


        reportRows.innerHTML = rows.map(r => `

            <tr>

                <td>
                    ${r.date}
                </td>


                <td>
                    ${r.employeeId?.name || ''}
                </td>


                <td>
                    ${r.scanned}
                </td>


                <td>
                    ${r.billed}
                </td>


                <td>
                    ${r.ewayBills}
                </td>


                <td>
                    ${r.maskAdding}
                </td>

                <td>
                    ${r.trackScan || 0}
                </td>

                <td>
                    ${r.notes || '-'}
                </td>


                <td>

                    <div
                        style="
                            display:flex;
                            gap:6px;
                            white-space:nowrap;
                        "
                    >

                        <button
                            class="btn"
                            onclick="editReport('${r._id}')"
                            style="
                                padding:7px 10px;
                                font-size:13px;
                            "
                        >
                            ✏️ Update
                        </button>


                        <button
                            class="btn"
                            onclick="deleteReport('${r._id}')"
                            style="
                                padding:7px 10px;
                                font-size:13px;
                                background:#ffe8e8;
                                color:#c62828;
                                border:1px solid #ffcaca;
                            "
                        >
                            🗑️ Delete
                        </button>

                    </div>

                </td>

            </tr>

        `).join('');


    } catch (e) {

        reportRows.innerHTML = `

            <tr>

                <td colspan="9">

                    ${e.message}

                </td>

            </tr>

        `;

    }

}


/* =========================
   EDIT REPORT
========================= */

async function editReport(id) {

    const report =
        reportCache.find(
            r => r._id === id
        );


    if (!report) {

        alert('Report not found.');

        return;
    }


    editingReportId = id;


    selectedAdminEmployee =
        report.employeeId?._id ||
        report.employeeId;


    /*
     * Re-render admin page.
     */

    await admin();


    const emp =
        document.getElementById('emp');


    const date =
        document.getElementById('date');


    const scanned =
        document.getElementById('scanned');


    const billed =
        document.getElementById('billed');


    const ewayBills =
        document.getElementById('ewayBills');


    const maskAdding =
        document.getElementById('maskAdding');

    const trackScan =
        document.getElementById('trackScan');

    const notes =
        document.getElementById('notes');


    if (emp) {

        emp.value =
            report.employeeId?._id ||
            report.employeeId;

    }


    if (date) {

        date.value =
            report.date;

    }


    if (scanned) {

        scanned.value =
            report.scanned;

    }


    if (billed) {

        billed.value =
            report.billed;

    }


    if (ewayBills) {

        ewayBills.value =
            report.ewayBills;

    }


    if (maskAdding) {

        maskAdding.value =
            report.maskAdding;

    }

    if (trackScan) {
        trackScan.value =
            report.trackScan || 0;
    }

    if (notes) {

        notes.value =
            report.notes || '';

    }


    const msg =
        document.getElementById('msg');


    if (msg) {

        msg.innerHTML = `

            <div class="notice">

                Editing report for
                <strong>${report.date}</strong>.

                Change the numbers and click
                <strong>Update Report</strong>.

            </div>

        `;

    }


    window.scrollTo({

        top: 0,

        behavior: 'smooth'

    });

}


/* =========================
   CANCEL EDIT
========================= */

async function cancelEdit() {

    editingReportId = null;

    await admin();

}


/* =========================
   DELETE REPORT
========================= */

async function deleteReport(id) {

    const report =
        reportCache.find(
            r => r._id === id
        );


    if (!report) {

        alert('Report not found.');

        return;
    }


    const employeeName =
        report.employeeId?.name ||
        'Employee';


    const confirmed =
        confirm(
            `Are you sure you want to delete the report for ${employeeName} on ${report.date}?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await api(
            '/api/reports/' + id,
            {
                method: 'DELETE'
            }
        );


        editingReportId = null;


        await loadAdminReports();


    } catch (e) {

        const msg =
            document.getElementById('msg');


        if (msg) {

            msg.innerHTML = `

                <div class="error">

                    ${e.message}

                </div>

            `;

        } else {

            alert(e.message);

        }

    }

}


/* =========================
   SAVE / UPDATE REPORT
========================= */

async function saveReport() {

    try {

        const wasEditing =
            Boolean(editingReportId);


        await api('/api/reports', {

            method: 'POST',

            body: {

                employeeId:
                    document
                        .getElementById('emp')
                        .value,

                date:
                    document
                        .getElementById('date')
                        .value,

                scanned:
                    document
                        .getElementById('scanned')
                        .value,

                billed:
                    document
                        .getElementById('billed')
                        .value,

                ewayBills:
                    document
                        .getElementById('ewayBills')
                        .value,

                maskAdding:
                    document
                        .getElementById('maskAdding')
                        .value,
                trackScan:
                    document
                        .getElementById('trackScan')
                        .value,                        
                notes:
                    document
                        .getElementById('notes')
                        .value

            }

        });


        editingReportId = null;


        const msg =
            document.getElementById('msg');


        if (msg) {

            msg.innerHTML = `

                <div class="notice">

                    ${
                        wasEditing
                            ? 'Report updated successfully.'
                            : 'Report saved successfully.'
                    }

                    Employee dashboard updates automatically.

                </div>

            `;

        }


        /*
         * Reload the selected employee's reports.
         */

        await loadAdminReports();


    } catch (e) {

        const msg =
            document.getElementById('msg');


        if (msg) {

            msg.innerHTML = `

                <div class="error">

                    ${e.message}

                </div>

            `;

        } else {

            alert(e.message);

        }

    }

}


/* =========================
   RENDER
========================= */

function render() {

    if (me.role === 'admin') {

        admin();

    } else {

        employee();

    }

}


/* =========================
   START APPLICATION
========================= */

if (token && me) {

    render();

} else {

    loginView();

}


/* =========================
   REAL-TIME UPDATES
========================= */

if (token) {

    const socket = io();


    socket.on(
        'report:changed',
        () => {

            if (me.role === 'admin') {

                loadAdminReports();

            } else {

                employee();

            }

        }
    );

}