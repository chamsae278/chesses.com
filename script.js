// script.js

// jQuery ready 함수로 전체 코드를 감싸줍니다.
// (HTML 문서와 jQuery 로드가 완료된 후에 실행됩니다.)
$(function () {
  // --- 1. 기존 사이드바 및 버튼 기능 ---
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent");

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", function () {
      sidebar.classList.toggle("close");
      mainContent.classList.toggle("shifted");
    });
  }

  // --- 2. 체스 게임 로직 ---

  // 게임 상태 변수들
  var board = null;
  var game = new Chess(); // chess.js 라이브러리 사용
  var $status = $("#status");
  // $fen, $pgn 변수는 현재 코드에서 사용되지 않으므로 제거하거나 그대로 두셔도 됩니다.

  // 👇 추가: PGN 기록을 표시할 HTML 요소를 jQuery 변수로 만듭니다.
  var $pgnText = $("#pgn-text");

  // 말이 드래그 시작될 때 (규칙 검사)
  function onDragStart(source, piece, position, orientation) {
    // 게임이 끝났으면 움직이지 못함
    if (game.game_over()) return false;

    // 내 차례가 아닌 말을 움직이려 할 때 방지
    if (
      (game.turn() === "w" && piece.search(/^b/) !== -1) ||
      (game.turn() === "b" && piece.search(/^w/) !== -1)
    ) {
      return false;
    }
  }

  // 말을 놓았을 때 (이동 처리)
  function onDrop(source, target) {
    // 이동이 가능한지 chess.js에게 물어봄
    var move = game.move({
      from: source,
      to: target,
      promotion: "q", // 승급은 무조건 퀸으로 (단순화)
    });

    // 불가능한 이동이면 다시 제자리로 튕겨냄
    if (move === null) return "snapback";

    updateStatus();

    updatePgn();
  }

  // 애니메이션이 끝난 후 보드 상태 동기화
  function onSnapEnd() {
    board.position(game.fen());
  }

  // 게임 상태 업데이트 (텍스트 표시)
  function updateStatus() {
    var status = "";

    var moveColor = "White (백)";
    if (game.turn() === "b") {
      moveColor = "Black (흑)";
    }

    // 체크메이트?
    if (game.in_checkmate()) {
      status = "게임 종료: " + moveColor + " 체크메이트 승!";
    }
    // 무승부?
    else if (game.in_draw()) {
      status = "게임 종료: 무승부";
    }
    // 진행 중
    else {
      status = moveColor + " 차례입니다.";
      // 체크 상태?
      if (game.in_check()) {
        status += ", " + moveColor + "이(가) 체크 상태입니다!";
      }
    }

    $status.html(status);
  }
  function updatePgn() {
    // chess.js의 pgn() 함수를 사용하여 전체 기록 문자열을 가져옵니다.
    var pgn = game.pgn();

    // 가져온 기록을 <pre id="pgn-text"></pre> 영역에 삽입합니다.
    // ' '로 대체하여 줄 바꿈을 제거하고 한 줄로 표시할 수도 있습니다.
    // $pgnText.text(pgn.replace(/\n/g, ' '));
    $pgnText.text(pgn);
  }
  // 체스판 설정 (설정 객체)
  var config = {
    draggable: true,
    position: "start",
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    // [수정된 이미지 CDN 주소] Wikimedia Commons에서 가져옵니다.
    pieceTheme: "pieces/{piece}.png",
  };
  // 체스판 그리기
  // 이 코드가 이제 HTML 준비 후에 실행됩니다.
  board = Chessboard("myBoard", config);

  // 초기 상태 텍스트 업데이트
  updateStatus();
}); // <-- jQuery ready 함수 끝
