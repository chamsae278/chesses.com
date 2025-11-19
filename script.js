// script.js

// 1. 필요한 HTML 요소들을 가져옵니다.
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');

// 2. 버튼 클릭 이벤트 리스너를 추가합니다.
hamburgerBtn.addEventListener('click', function() {
    
    // 3. 사이드바 클래스를 토글합니다 (open/close).
    // .open 클래스가 없으면 추가하고, 있으면 제거합니다.
    sidebar.classList.toggle('close');
    
    // 4. 메인 콘텐츠 클래스를 토글합니다 (shifted/normal).
    // .shifted 클래스가 없으면 추가하고, 있으면 제거합니다.
    // 이는 사이드바가 열릴 때 콘텐츠를 오른쪽으로 밀어내기 위함입니다.
    mainContent.classList.toggle('shifted');
});