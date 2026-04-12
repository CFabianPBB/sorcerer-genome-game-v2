// ============================================================
// LEADERBOARD — Self-contained snippet for all chapters
// Add this at the end of each chapter's <script> block
// Set LEADERBOARD_CHAPTER and LEADERBOARD_SCORE_FN before pasting
// ============================================================

// Config — set these per chapter:
// const LEADERBOARD_CHAPTER = 1;
// const LEADERBOARD_API = 'https://your-render-url.onrender.com';
// function getPlayerScore() { return { score: 123, details: {} }; }

(function initLeaderboard() {
    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
        .lb-fab {
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            z-index: 400; padding: 10px 22px; border-radius: 25px;
            background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
            border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.6);
            font-size: 0.75em; letter-spacing: 2px; text-transform: uppercase;
            cursor: pointer; transition: all 0.3s; backdrop-filter: blur(10px);
            font-family: inherit;
        }
        .lb-fab:hover {
            background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08));
            color: #fff; border-color: rgba(255,255,255,0.3);
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .lb-overlay {
            display: none; position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); z-index: 3500;
            justify-content: center; align-items: center;
            animation: lbFadeIn 0.3s ease-out;
        }
        .lb-overlay.active { display: flex; }
        @keyframes lbFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .lb-modal {
            background: linear-gradient(135deg, #0a1020, #141e30);
            border: 1px solid rgba(255,255,255,0.1); border-radius: 14px;
            padding: 28px; max-width: 440px; width: 92%;
            box-shadow: 0 25px 80px rgba(0,0,0,0.5);
            max-height: 85vh; overflow-y: auto;
        }
        .lb-title {
            text-align: center; font-size: 1.2em; font-weight: 300;
            letter-spacing: 4px; text-transform: uppercase;
            color: #ffd700; margin-bottom: 6px;
        }
        .lb-subtitle {
            text-align: center; font-size: 0.7em;
            color: rgba(255,255,255,0.35); letter-spacing: 2px;
            text-transform: uppercase; margin-bottom: 18px;
        }
        .lb-tabs {
            display: flex; gap: 0; margin-bottom: 16px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .lb-tab {
            flex: 1; padding: 8px; text-align: center;
            font-size: 0.7em; letter-spacing: 1.5px; text-transform: uppercase;
            color: rgba(255,255,255,0.35); cursor: pointer;
            border-bottom: 2px solid transparent; transition: all 0.2s;
            background: none; border-top: none; border-left: none; border-right: none;
            font-family: inherit;
        }
        .lb-tab:hover { color: rgba(255,255,255,0.6); }
        .lb-tab.active { color: #ffd700; border-bottom-color: #ffd700; }
        .lb-list { min-height: 120px; }
        .lb-row {
            display: flex; align-items: center; gap: 10px;
            padding: 8px 6px; border-bottom: 1px solid rgba(255,255,255,0.04);
            font-size: 0.82em;
        }
        .lb-row:last-child { border-bottom: none; }
        .lb-rank {
            width: 24px; text-align: center; font-weight: bold;
            color: rgba(255,255,255,0.3); font-size: 0.9em;
        }
        .lb-row:nth-child(1) .lb-rank { color: #ffd700; font-size: 1.1em; }
        .lb-row:nth-child(2) .lb-rank { color: #c0c0c0; }
        .lb-row:nth-child(3) .lb-rank { color: #cd7f32; }
        .lb-name { flex: 1; color: rgba(255,255,255,0.75); }
        .lb-score { font-weight: bold; color: #ffd700; font-variant-numeric: tabular-nums; }
        .lb-empty {
            text-align: center; padding: 30px 10px;
            color: rgba(255,255,255,0.25); font-size: 0.85em; font-style: italic;
        }
        .lb-submit-section {
            margin-top: 16px; padding-top: 14px;
            border-top: 1px solid rgba(255,255,255,0.08);
        }
        .lb-input-row { display: flex; gap: 8px; margin-bottom: 8px; }
        .lb-input {
            flex: 1; padding: 9px 12px; border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.12);
            background: rgba(255,255,255,0.04); color: #fff;
            font-size: 0.85em; font-family: inherit;
            outline: none; transition: border-color 0.2s;
        }
        .lb-input:focus { border-color: rgba(255,215,0,0.4); }
        .lb-input::placeholder { color: rgba(255,255,255,0.2); }
        .lb-submit-btn {
            padding: 9px 20px; border-radius: 8px; border: none;
            background: linear-gradient(135deg, #ffd700, #e6b800);
            color: #000; font-weight: bold; font-size: 0.8em;
            cursor: pointer; transition: transform 0.2s;
            font-family: inherit; letter-spacing: 1px;
        }
        .lb-submit-btn:hover { transform: scale(1.03); }
        .lb-submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .lb-your-score {
            font-size: 0.75em; color: rgba(255,255,255,0.35);
            text-align: center; margin-bottom: 8px;
        }
        .lb-your-score strong { color: #ffd700; font-size: 1.1em; }
        .lb-status {
            text-align: center; font-size: 0.75em;
            color: rgba(255,255,255,0.35); margin-top: 6px; min-height: 18px;
        }
        .lb-close {
            position: absolute; top: 12px; right: 14px;
            width: 30px; height: 30px; border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.1);
            background: transparent; color: rgba(255,255,255,0.4);
            font-size: 1em; cursor: pointer; display: flex;
            align-items: center; justify-content: center;
            transition: all 0.2s;
        }
        .lb-close:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
        .lb-modal { position: relative; }
        @media (max-width: 768px) {
            .lb-fab { bottom: 12px; padding: 8px 16px; font-size: 0.65em; }
            .lb-modal { padding: 20px; }
        }
    `;
    document.head.appendChild(style);

    // Inject floating button
    const fab = document.createElement('button');
    fab.className = 'lb-fab';
    fab.textContent = '🏆 Leaderboard';
    fab.onclick = openLeaderboard;
    document.body.appendChild(fab);

    // Inject overlay
    const overlay = document.createElement('div');
    overlay.className = 'lb-overlay';
    overlay.id = 'lb-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) closeLeaderboard(); };
    overlay.innerHTML = `
        <div class="lb-modal">
            <button class="lb-close" onclick="closeLeaderboard()">&times;</button>
            <div class="lb-title">Leaderboard</div>
            <div class="lb-subtitle">Voyage of the Sorcerer II</div>
            <div class="lb-tabs">
                <button class="lb-tab active" data-tab="chapter" onclick="switchLbTab('chapter', this)">Chapter ${LEADERBOARD_CHAPTER}</button>
                <button class="lb-tab" data-tab="overall" onclick="switchLbTab('overall', this)">Overall</button>
            </div>
            <div class="lb-list" id="lb-list"></div>
            <div class="lb-submit-section">
                <div class="lb-your-score">Your score: <strong id="lb-your-score">0</strong></div>
                <div class="lb-input-row">
                    <input class="lb-input" id="lb-name-input" type="text" placeholder="Enter your name..." maxlength="30"/>
                    <button class="lb-submit-btn" id="lb-submit-btn" onclick="submitScore()">Submit</button>
                </div>
                <div class="lb-status" id="lb-status"></div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Load saved name
    try {
        const savedName = localStorage.getItem('sorcerer2.playerName');
        if (savedName) document.getElementById('lb-name-input').value = savedName;
    } catch(e) {}
})();

let _lbCurrentTab = 'chapter';

function openLeaderboard() {
    document.getElementById('lb-overlay').classList.add('active');
    const scoreData = getPlayerScore();
    document.getElementById('lb-your-score').textContent = scoreData.score.toLocaleString();
    fetchLeaderboard(_lbCurrentTab);
}

function closeLeaderboard() {
    document.getElementById('lb-overlay').classList.remove('active');
}

function switchLbTab(tab, el) {
    _lbCurrentTab = tab;
    document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    fetchLeaderboard(tab);
}

function fetchLeaderboard(tab) {
    const list = document.getElementById('lb-list');
    list.innerHTML = '<div class="lb-empty">Loading...</div>';

    const url = tab === 'chapter'
        ? `${LEADERBOARD_API}/api/leaderboard/${LEADERBOARD_CHAPTER}`
        : `${LEADERBOARD_API}/api/leaderboard`;

    fetch(url)
        .then(r => r.json())
        .then(data => {
            const entries = data.leaderboard || [];
            if (entries.length === 0) {
                list.innerHTML = '<div class="lb-empty">No scores yet. Be the first!</div>';
                return;
            }
            list.innerHTML = entries.map(e => `
                <div class="lb-row">
                    <div class="lb-rank">${e.rank}</div>
                    <div class="lb-name">${escHtml(e.player_name)}</div>
                    <div class="lb-score">${(e.score || e.total_score || 0).toLocaleString()}</div>
                </div>
            `).join('');
        })
        .catch(() => {
            list.innerHTML = '<div class="lb-empty">Could not connect to leaderboard server.</div>';
        });
}

function submitScore() {
    const nameInput = document.getElementById('lb-name-input');
    const name = nameInput.value.trim();
    if (!name) {
        document.getElementById('lb-status').textContent = 'Please enter your name.';
        return;
    }

    const btn = document.getElementById('lb-submit-btn');
    btn.disabled = true;

    const scoreData = getPlayerScore();

    // Save name for next time
    try { localStorage.setItem('sorcerer2.playerName', name); } catch(e) {}

    fetch(`${LEADERBOARD_API}/api/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            player_name: name,
            chapter: LEADERBOARD_CHAPTER,
            score: scoreData.score,
            details: scoreData.details
        })
    })
    .then(r => r.json())
    .then(data => {
        document.getElementById('lb-status').textContent = 'Score submitted!';
        btn.disabled = false;
        fetchLeaderboard(_lbCurrentTab);
    })
    .catch(() => {
        document.getElementById('lb-status').textContent = 'Could not submit. Try again later.';
        btn.disabled = false;
    });
}

function escHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
