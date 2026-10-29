document.documentElement.style.display = "none";

(async () => {

    const [tab] =
        await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

    const url =
        tab?.url || "";
const isEntryPage =
    /^https:\/\/playentry\.org\/(?:ws|project)(?:\/|$)/i
        .test(url) ||
    /^https:\/\/playentry\.org\/community\/tips\/list(?:\?|$)/i
        .test(url);
   

    if (!isEntryPage) {
        window.close();
        return;
    }

    document.documentElement.style.display = "";

})();
const statusText = document.getElementById("status");
const toggleButton = document.getElementById("toggle");


function updateUI(enabled) {
    if (enabled) {
        statusText.textContent = "현재 상태: 켜짐";
        toggleButton.textContent = "끄기";
    } else {
        statusText.textContent = "현재 상태: 꺼짐";
        toggleButton.textContent = "켜기";
    }
}

chrome.storage.local.get(["enabled"], (result) => {
    const enabled =
        typeof result.enabled === "boolean"
            ? result.enabled
            : false;

    updateUI(enabled);
});

toggleButton.addEventListener("click", () => {
    chrome.storage.local.get(["enabled"], (result) => {
        const current =
            typeof result.enabled === "boolean"
                ? result.enabled
                : false;

        const next = !current;

        chrome.storage.local.set(
            {
                enabled: next
            },
            () => {
                updateUI(next);
            }
        );
    });
});

// Invert project display colors only after confirming the active tab URL.
document.getElementById("invertProjectColors").addEventListener("click", async () => {
    const result = document.getElementById("invertProjectColorsResult");

    try {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        if (!tab?.id || !tab.url?.startsWith("https://playentry.org/project")) {
            result.textContent = "엔트리 작품 보기 페이지에서만 사용할 수 있습니다.";
            return;
        }

        const frames = await chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: true },
            func: () => {
                const target = document.querySelector('.css-1gvhr.e1ayezcv9');
                if (!target) {
                    return null;
                }

                // Read the actual project display state, so reopening the popup
                // does not reset the toggle.
                const isInverted = target.style.filter === 'invert(100%)' ||
                    target.style.filter === 'invert(1)';

                if (isInverted) {
                    document.querySelector('.css-1gvhr.e1ayezcv9').style.filter = 'invert(0%)';
                    return 'off';
                }

                document.querySelector('.css-1gvhr.e1ayezcv9').style.filter = 'invert(100%)';
                return 'on';
            }
        });

        const applied = frames.find(frame => frame.result === 'on' || frame.result === 'off');
        result.textContent = !applied
            ? "작품 화면 요소를 찾지 못했습니다."
            : applied.result === 'on'
                ? "색상반전 적용 완료"
                : "색상반전 해제 완료";
    } catch (error) {
        console.error("[콘솔을 편하게] 색상반전 실패:", error);
        result.textContent = "색상반전 적용에 실패했습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.";
    }
});

const blockIdInput = document.getElementById("blockId");
const addBlockButton = document.getElementById("addBlock");
const addResult = document.getElementById("addResult");

addBlockButton.addEventListener("click", async () => {
    const blockId = blockIdInput.value.trim();

    if (!blockId) {
        alert("블록 ID를 입력하세요.");
        return;
    }

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    if (!tab || !tab.id) {
        alert("현재 탭을 찾을 수 없습니다.");
        return;
    }

    if (
        !tab.url ||
        !tab.url.startsWith("https://playentry.org/ws/")
    ) {
        alert("엔트리 작품 만들기 페이지가 아닙니다.");
        return;
    }

    chrome.tabs.sendMessage(
        tab.id,
        {
            type: "ADD_ENTRY_BLOCK",
            blockId: blockId
        },
        (response) => {
            if (chrome.runtime.lastError) {
    alert("엔트리 작품 만들기 페이지가 아닙니다.");
    return;
}

if (response?.success) {
    saveRecentBlock(blockId);
    addResult.textContent = `추가 요청 완료: ${blockId}`;
} else {
    alert("블록 추가에 실패했습니다.");
}
        }
    );
});
function saveRecentBlock(blockId) {
    chrome.storage.local.get(["recentBlocks"], (result) => {
        let recentBlocks = Array.isArray(result.recentBlocks)
            ? result.recentBlocks
            : [];

        recentBlocks = recentBlocks.filter(
            (id) => id !== blockId
        );

        recentBlocks.unshift(blockId);

        recentBlocks = recentBlocks.slice(0, 10);

        chrome.storage.local.set({
            recentBlocks: recentBlocks
        }, () => {
            renderRecentBlocks();
        });
    });
}
const recentBlocksBox = document.getElementById("recentBlocks");

function renderRecentBlocks() {
    chrome.storage.local.get(["recentBlocks"], (result) => {
        const recentBlocks = Array.isArray(result.recentBlocks)
            ? result.recentBlocks
            : [];

        recentBlocksBox.innerHTML = "";

        recentBlocks.forEach((blockId) => {
    const button = document.createElement("button");

    button.textContent = blockId;

    button.style.display = "block";
    button.style.width = "100%";
    button.style.marginBottom = "6px";
    button.style.padding = "8px";
    button.style.cursor = "pointer";

    button.addEventListener("click", () => {
        blockIdInput.value = blockId;
        addBlockButton.click();
    });

    recentBlocksBox.appendChild(button);
});
    });
}

renderRecentBlocks();
const unofficialBlocksBox = document.getElementById("unofficialBlocks");

const unofficialBlocks = [
{name:"더미데이터",file:"unofficial/dummy.js"},
{name:"강력크블록",file:"unofficial/strong.js"},
{name:"공용블록",file:"unofficial/common.js"},
{name:"뉴블록",file:"unofficial/newblock.js"},
{name:"크리스블록",file:"unofficial/kris.js"},
{name:"특수블록",file:"unofficial/tecsu.js"},
{name:"동영상블록",file:"unofficial/video.js"},
{name:"파일블록",file:"unofficial/fileio.js"},
{name:"ES 블록",file:"unofficial/entsave.js"}
];


async function getUnofficialProjectKey() {

    const [tab] =
        await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

    if (
        !tab ||
        !tab.url
    ) {
        return null;
    }

    const match =
        tab.url.match(
            /\/(?:ws|project)\/([a-f0-9]{24})(?:\/|$|\?)/i
        );

    if (match) {
        return "unofficialBlockStates_" + match[1];
    }

    if (
        tab.url.startsWith(
            "https://playentry.org/ws"
        )
    ) {
        return "unofficialBlockStates_new";
    }

    return null;
}

(async () => {

    const storageKey =
        await getUnofficialProjectKey();

    if (!storageKey) {
        return;
    }

    chrome.storage.local.get(
        [storageKey],
        (result) => {

            const states =
                result[storageKey] || {};

            unofficialBlocks.forEach((item) => {

                const label =
                    document.createElement("label");

                label.style.display = "flex";
                label.style.alignItems = "center";
                label.style.gap = "8px";
                label.style.padding = "7px 2px";
                label.style.cursor = "pointer";

                const checkbox =
                    document.createElement("input");

                checkbox.type = "checkbox";

                checkbox.style.width = "auto";
                checkbox.style.margin = "0";
                checkbox.style.padding = "0";

                checkbox.checked =
                    states[item.file] === true;

                const text =
                    document.createElement("span");

                text.textContent =
                    item.name;

                checkbox.addEventListener(
                    "change",
                    () => {

                        chrome.storage.local.get(
                            [storageKey],
                            (result) => {

                                const newStates = {
                                    ...(result[storageKey] || {})
                                };

                                newStates[item.file] =
                                    checkbox.checked;

                                chrome.storage.local.set({
                                    [storageKey]:
                                        newStates
                                });
                            }
                        );
                    }
                );

                label.appendChild(
                    checkbox
                );

                label.appendChild(
                    text
                );

                unofficialBlocksBox.appendChild(
                    label
                );
            });
        }
    );

})();


const selectAllUnofficialButton =
    document.getElementById("selectAllUnofficial");
const applyUnofficialButton =
    document.getElementById("applyUnofficial");

applyUnofficialButton.addEventListener(
    "click",
    async () => {

        const [tab] =
            await chrome.tabs.query({
                active: true,
                currentWindow: true
            });

        const isWorkspace =
    tab?.url?.startsWith(
        "https://playentry.org/ws/"
    );

const isTips =
    tab?.url?.startsWith(
        "https://playentry.org/community/tips/list"
    );
if (
    !tab ||
    !tab.id ||
    !tab.url ||
    !tab.url.startsWith(
        "https://playentry.org/ws/"
    )
) {
    alert(
        "엔트리 작품 만들기 페이지가 아닙니다."
    );
    return;
}


        chrome.tabs.sendMessage(
    tab.id,
    {
        type:
            "SAVE_AND_RELOAD_UNOFFICIAL"
    },
    () => {

        if (chrome.runtime.lastError) {
            alert(
                "엔트리 페이지를 새로고침해 주세요."
            );
        }
    }
);
    }
);
const unloadUnofficialButton =
    document.getElementById("unloadUnofficial");


selectAllUnofficialButton.addEventListener(
    "click",
    async () => {

        const storageKey =
            await getUnofficialProjectKey();

        if (!storageKey) {
            return;
        }

        const allStates = {};

        unofficialBlocks.forEach((item) => {
            allStates[item.file] = true;
        });

        chrome.storage.local.set(
            {
                [storageKey]: allStates
            },
            () => {

                const checkboxes =
                    unofficialBlocksBox.querySelectorAll(
                        'input[type="checkbox"]'
                    );

                checkboxes.forEach((checkbox) => {
                    checkbox.checked = true;
                });
            }
        );
    }
);


unloadUnofficialButton.addEventListener(
    "click",
    async () => {

        const [tab] =
            await chrome.tabs.query({
                active: true,
                currentWindow: true
            });

        if (
            !tab ||
            !tab.id ||
            !tab.url ||
            !tab.url.startsWith(
                "https://playentry.org/ws/"
            )
        ) {
            alert(
                "엔트리 작품 만들기 페이지가 아닙니다."
            );
            return;
        }

        const storageKey =
            await getUnofficialProjectKey();

        if (!storageKey) {
            return;
        }

        chrome.storage.local.set(
            {
                [storageKey]: {}
            },
            () => {

                const checkboxes =
                    unofficialBlocksBox.querySelectorAll(
                        'input[type="checkbox"]'
                    );

                checkboxes.forEach((checkbox) => {
                    checkbox.checked = false;
                });

                
            }
        );
    }
);

async function runEntryAction(action, data = {}) {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

  const isWorkspace =
    tab?.url?.startsWith(
        "https://playentry.org/ws/"
    );

const isTips =
    tab?.url?.startsWith(
        "https://playentry.org/community/tips/list"
    );

if (
    !tab ||
    !tab.id ||
    !tab.url ||
    (!isWorkspace && !isTips)
) {
    alert(
        "지원하는 엔트리 페이지가 아닙니다."
    );
    return;
}

    chrome.tabs.sendMessage(
        tab.id,
        {
            type: "ENTRY_ACTION",
            action: action,
            data: data
        },
        () => {
            if (chrome.runtime.lastError) {
                alert("엔트리 페이지를 새로고침해 주세요.");
            }
        }
    );
}

// 1. 모든 블록 불러오기

document
.getElementById("unbanBlocks")
.addEventListener("click", () => {

runEntryAction("UNBAN_BLOCKS");

});

// 3. 초시계 설정

document
.getElementById("applyTimer")
.addEventListener("click", () => {

const name =
document.getElementById("timerName").value;

const x =
document.getElementById("timerX").value;

const y =
document.getElementById("timerY").value;

runEntryAction(
"SET_TIMER",
{
name: name,
x: x,
y: y
}
);

});


document
.getElementById("showTimer")
.addEventListener("click", () => {

runEntryAction("SHOW_TIMER");

});


document
.getElementById("hideTimer")
.addEventListener("click", () => {

runEntryAction("HIDE_TIMER");

});


// 4. 함수 지역변수 추가

document
.getElementById("addLocalVariable")
.addEventListener("click", () => {

const count =
Number(
document.getElementById("localVariableCount").value
);

if (
!Number.isInteger(count) ||
count <= 0
) {
alert("추가할 개수를 입력하세요.");
return;
}

runEntryAction(
"ADD_LOCAL_VARIABLE",
{
count: count
}
);

});


// 5. 프레임 속도 설정

document
.getElementById("applyFrameSpeed")
.addEventListener("click", () => {

const speed =
Number(
document.getElementById("frameSpeed").value
);

if (
!Number.isFinite(speed) ||
speed <= 0
) {
alert("올바른 프레임 속도를 입력하세요.");
return;
}

runEntryAction(
"SET_FRAME_SPEED",
{
speed: speed
}
);

});

// 6. 변수 랜덤 이동

document
.getElementById("startVariableMove")
.addEventListener("click", () => {

    runEntryAction(
        "START_VARIABLE_MOVE"
    );

});


document
.getElementById("stopVariableMove")
.addEventListener("click", () => {

    runEntryAction(
        "STOP_VARIABLE_MOVE"
    );

});
document
.getElementById("openTipsDate")
.addEventListener(
    "click",
    () => {

        const date =
            document
                .getElementById(
                    "tipsDate"
                )
                .value;

        if (!date) {
            alert(
                "날짜를 입력하세요."
            );
            return;
        }

        runEntryAction(
            "OPEN_TIPS_DATE",
            {
                date: date
            }
        );
    }
);
document
.getElementById("lockSelectedParams")
.addEventListener("click", () => {

    runEntryAction(
        "LOCK_SELECTED_PARAMS"
    );

});
/* =========================================
   새 작품 자동 저장 ON / OFF
   ========================================= */

const AUTO_SAVE_NEW_PROJECT_KEY =
    "autoSaveNewProjectAllowed";

const autoSaveStatus =
    document.getElementById(
        "autoSaveStatus"
    );

const autoSaveToggle =
    document.getElementById(
        "autoSaveToggle"
    );


function renderAutoSaveState(
    allowed
) {

    autoSaveStatus.textContent =
        allowed
            ? "상태: 자동 저장 허용"
            : "상태: 자동 저장 차단";

    autoSaveToggle.textContent =
        allowed
            ? "자동 저장 차단"
            : "자동 저장 허용";
}


/*
 * 최초 상태
 * 값이 없으면 기본 OFF
 */
chrome.storage.local.get(
    [AUTO_SAVE_NEW_PROJECT_KEY],
    (result) => {

        const allowed =
            typeof result[
                AUTO_SAVE_NEW_PROJECT_KEY
            ] === "boolean"
                ? result[
                    AUTO_SAVE_NEW_PROJECT_KEY
                ]
                : false;

        renderAutoSaveState(
            allowed
        );
    }
);


/*
 * ON / OFF
 */
autoSaveToggle.addEventListener(
    "click",
    () => {

        chrome.storage.local.get(
            [AUTO_SAVE_NEW_PROJECT_KEY],
            (result) => {

                const current =
                    typeof result[
                        AUTO_SAVE_NEW_PROJECT_KEY
                    ] === "boolean"
                        ? result[
                            AUTO_SAVE_NEW_PROJECT_KEY
                        ]
                        : false;

                const next =
                    !current;

                chrome.storage.local.set(
                    {
                        [AUTO_SAVE_NEW_PROJECT_KEY]:
                            next
                    },
                    () => {

                        renderAutoSaveState(
                            next
                        );
                    }
                );
            }
        );
    }
);

// Function/variable creation preferences: absent key means forbidden.
(() => {
  const items = [
    { key: 'allowEntryFunctionCreate', status: 'functionCreateStatus', toggle: 'functionCreateToggle', label: '함수' },
    { key: 'allowEntryVariableCreate', status: 'variableCreateStatus', toggle: 'variableCreateToggle', label: '변수' }
  ];
  for (const item of items) {
    const status = document.getElementById(item.status);
    const button = document.getElementById(item.toggle);
    if (!status || !button) continue;
    const render = (allowed) => {
      status.textContent = '상태: ' + (allowed ? '허용' : '금지');
      button.textContent = item.label + ' 추가 ' + (allowed ? '금지하기' : '허용하기');
    };
    chrome.storage.local.get([item.key], (result) => render(result[item.key] === true));
    button.addEventListener('click', () => {
      chrome.storage.local.get([item.key], (result) => {
        const next = result[item.key] !== true;
        chrome.storage.local.set({ [item.key]: next }, () => {
          if (chrome.runtime.lastError) {
            console.error('[콘솔을 편하게] 설정 저장 실패', chrome.runtime.lastError);
            return;
          }
          render(next);
        });
      });
    });
  }
})();
