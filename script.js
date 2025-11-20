
        const appState = {
            isLoggedIn: false,
            currentUser: null,
            currentPage: 1,
            itemsPerPage: 5,
            sortColumn: null,
            sortOrder: 'asc',
            allData: [
                { name: 'Ntakadzeni Phidzaglima', email: 'ntaka@example.com', age: 23 },
                { name: 'Ntanganedzeni Phidzaglima', email: 'ntanga@example.com', age: 21 },
                { name: 'Elelwani Khavhagali', email: 'ele@example.com', age: 19 },
                { name: 'Livhuwani Khavhagali', email: 'livhu@example.com', age: 17 },
                { name: 'Thifhelimbilu Khavhagali', email: 'fheli@example.com', age: 15 },
                { name: 'Khathutshelo Khavhagali', email: 'khathu@example.com', age: 13 },
                { name: 'Wanga Phidzaglima', email: 'wanga@example.com', age: 11 },
                { name: 'Rotondwa Phidzaglima', email: 'rotondwa@example.com', age: 9 },
                { name: 'Romeo Phidzaglima', email: 'romeo@example.com', age: 7 },
                { name: 'Zwoluga Phidzaglima', email: 'zwolu@example.com', age: 5 },
                { name: 'Rialivhuwa Phidzaglima', email: 'ria@example.com', age: 3 }
            ],
            filteredData: []
        };

        function showSection(sectionId) {
            document.querySelectorAll('section').forEach(section => {
                section.classList.remove('active');
            });
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('active');
                if (sectionId === 'tables') {
                    appState.filteredData = [...appState.allData];
                    appState.currentPage = 1;
                    renderTable();
                    renderPagination();
                }
                if (sectionId === 'dynamic') {
                    setupDynamicElements();
                }
            }
        }

        function handleLogin(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const alertDiv = document.getElementById('loginAlert');

            if (username === 'admin' && password === 'password123') {
                appState.isLoggedIn = true;
                appState.currentUser = username;
                showAlert('loginAlert', 'Login successful! Redirecting...', 'success');
                document.getElementById('logoutBtn').style.display = 'block';
                setTimeout(() => {
                    document.getElementById('username').value = '';
                    document.getElementById('password').value = '';
                    showSection('home');
                }, 1500);
            } else {
                showAlert('loginAlert', 'Invalid username or password. Try: admin / password123', 'error');
            }
        }

        function handleRegister(event) {
            event.preventDefault();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const fullName = document.getElementById('fullName').value;
            const gender = document.querySelector('input[name="gender"]:checked');

            if (password !== confirmPassword) {
                showAlert('registerAlert', 'Passwords do not match!', 'error');
                return;
            }

            if (!gender) {
                showAlert('registerAlert', 'Please select a gender!', 'error');
                return;
            }

            showAlert('registerAlert', `Registration successful for ${fullName}!`, 'success');
            event.target.reset();
            setTimeout(() => {
                showSection('login');
            }, 2000);
        }

        function logout() {
            appState.isLoggedIn = false;
            appState.currentUser = null;
            document.getElementById('logoutBtn').style.display = 'none';
            showSection('home');
            showNotification('Logged out successfully');
        }

        function showAlert(elementId, message, type) {
            const alertDiv = document.getElementById(elementId);
            alertDiv.textContent = message;
            alertDiv.className = `alert ${type} active`;
            setTimeout(() => {
                alertDiv.classList.remove('active');
            }, 4000);
        }

        function showSimpleAlert() {
            alert('This is a simple JavaScript alert!');
        }

        function showConfirm() {
            const result = confirm('Do you want to proceed?');
            if (result) {
                showNotification('You clicked OK');
            } else {
                showNotification('You clicked Cancel');
            }
        }

        function showPrompt() {
            const result = prompt('Please enter your name:');
            if (result) {
                showNotification(`Hello, ${result}!`);
            }
        }

        function openNewTab() {
            window.open('about:blank', '_blank');
        }

        function showNotification(message) {
            const notif = document.createElement('div');
            notif.className = 'notification';
            notif.textContent = message;
            document.body.appendChild(notif);
            setTimeout(() => notif.remove(), 3000);
        }

        function setupDynamicElements() {
            document.getElementById('delayedButton').style.display = 'none';
            document.getElementById('delayedContent').style.display = 'none';
            document.getElementById('loadingSpinner').style.display = 'block';
            
            setTimeout(() => {
                document.getElementById('loadingSpinner').style.display = 'none';
                document.getElementById('delayedButton').style.display = 'block';
                document.getElementById('delayedContent').style.display = 'block';
                document.getElementById('dynamicBtn').onclick = () => showNotification('Dynamic button clicked!');
            }, 5000);
        }

        function renderTable() {
            const tbody = document.getElementById('tableBody');
            tbody.innerHTML = '';
            const start = (appState.currentPage - 1) * appState.itemsPerPage;
            const end = start + appState.itemsPerPage;
            const pageData = appState.filteredData.slice(start, end);

            pageData.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${item.name}</td><td>${item.email}</td><td>${item.age}</td>`;
                tbody.appendChild(row);
            });
        }

        function renderPagination() {
            const pagination = document.getElementById('pagination');
            pagination.innerHTML = '';
            const totalPages = Math.ceil(appState.filteredData.length / appState.itemsPerPage);

            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('button');
                btn.textContent = i;
                btn.className = i === appState.currentPage ? 'active' : '';
                btn.onclick = () => {
                    appState.currentPage = i;
                    renderTable();
                    renderPagination();
                };
                pagination.appendChild(btn);
            }
        }

        function filterTable() {
            const search = document.getElementById('searchInput').value.toLowerCase();
            appState.filteredData = appState.allData.filter(item =>
                item.name.toLowerCase().includes(search) || item.email.toLowerCase().includes(search)
            );
            appState.currentPage = 1;
            renderTable();
            renderPagination();
        }

        function sortTable(column) {
            if (appState.sortColumn === column) {
                appState.sortOrder = appState.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                appState.sortColumn = column;
                appState.sortOrder = 'asc';
            }

            appState.filteredData.sort((a, b) => {
                let valA = a[column];
                let valB = b[column];
                
                if (typeof valA === 'string') {
                    valA = valA.toLowerCase();
                    valB = valB.toLowerCase();
                }

                if (appState.sortOrder === 'asc') {
                    return valA > valB ? 1 : -1;
                } else {
                    return valA < valB ? 1 : -1;
                }
            });

            appState.currentPage = 1;
            renderTable();
            renderPagination();
        }

        function handleFileUpload() {
            const fileInput = document.getElementById('fileUpload');
            const uploadStatus = document.getElementById('uploadStatus');

            if (fileInput.files.length === 0) {
                showAlert('uploadStatus', 'Please select a file first!', 'error');
                return;
            }

            const file = fileInput.files[0];
            showAlert('uploadStatus', `File "${file.name}" uploaded successfully!`, 'success');
            fileInput.value = '';
        }

        function downloadPDF() {
            const content = 'This is a sample PDF file generated for Selenium testing.';
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
            element.setAttribute('download', 'sample.txt');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }

        function downloadTXT() {
            const content = `Selenium Practice App - Sample Download
=====================================
Date: ${new Date().toLocaleString()}
Content: This is a text file for testing file downloads.
This file can be used to practice downloading files with Selenium.`;
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
            element.setAttribute('download', 'selenium-sample.txt');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }

        function toggleHidden() {
            const hidden = document.getElementById('hiddenElement');
            const btn = document.getElementById('showHiddenBtn');
            if (hidden.classList.contains('visible')) {
                hidden.classList.remove('visible');
                btn.textContent = 'Reveal Hidden Element';
            } else {
                hidden.classList.add('visible');
                btn.textContent = 'Hide Element';
            }
        }

        function fetchUserData() {
            const resultsDiv = document.getElementById('apiResults');
            const spinner = document.getElementById('loadingSpinner2');
            
            spinner.style.display = 'block';
            resultsDiv.style.display = 'none';

            setTimeout(() => {
                spinner.style.display = 'none';
                const mockUsers = [
                    { id: 1, name: 'Ntakadzeni Phidzaglima', email: 'ntaka@example.com', role: 'Admin' },
                    { id: 2, name: 'Ntanganedzeni Phidzaglima', email: 'ntanga@example.com', role: 'User' },
                    { id: 3, name: 'Elelwani Khavhagali', email: 'ele@example.com', role: 'User' }
                ];
                
                resultsDiv.innerHTML = '<strong>API Response (Mock Data):</strong><br>' + 
                    mockUsers.map(u => `ID: ${u.id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`).join('<br>');
                resultsDiv.style.display = 'block';
                showNotification('Data fetched successfully!');
            }, 2000);
        }

        // Table search event listener
        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.addEventListener('keyup', filterTable);
            }

            // Table header click handlers
            document.getElementById('nameHeader').addEventListener('click', () => sortTable('name'));
            document.getElementById('emailHeader').addEventListener('click', () => sortTable('email'));
            document.getElementById('ageHeader').addEventListener('click', () => sortTable('age'));

            // Drag and drop handlers
            const draggable = document.getElementById('draggableItem');
            const boxB = document.getElementById('boxB');

            draggable.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', draggable.innerHTML);
            });

            boxB.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                boxB.classList.add('drag-over');
            });

            boxB.addEventListener('dragleave', () => {
                boxB.classList.remove('drag-over');
            });

            boxB.addEventListener('drop', (e) => {
                e.preventDefault();
                boxB.classList.remove('drag-over');
                draggable.remove();
                boxB.textContent = '';
                const newItem = document.createElement('div');
                newItem.className = 'draggable';
                newItem.textContent = 'Drag me!';
                boxB.appendChild(newItem);
                showNotification('Item dropped successfully!');
            });
        });