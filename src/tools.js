import fa_user_circle from "@fortawesome/fontawesome-free/svgs/solid/circle-user.svg";
import fa_xmark from "@fortawesome/fontawesome-free/svgs/solid/xmark.svg";

import showMessage from "./message.js";

const tools = {
    // 切换模型按钮
    "switch-model": {
        icon: fa_user_circle,
        callback: () => {
            const panel = document.getElementById("model-selection-panel");
            panel.style.display = panel.style.display === "none" ? "block" : "none";
        }
    },

    // 关闭按钮
    "quit": {
        icon: fa_xmark,
        callback: () => {
            localStorage.setItem("waifu-display", Date.now());
            document.getElementById("waifu").style.bottom = "-500px";
            setTimeout(() => {
                document.getElementById("waifu-toggle").classList.add("waifu-toggle-active");
            }, 3000);
        }
    }
};

export default tools;
