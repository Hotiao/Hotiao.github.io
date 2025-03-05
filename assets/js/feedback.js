class FeedbackHandler {
    constructor() {
        this.form = document.getElementById("feedback-form");
        this.apiEndpoint = "https://api.hotiao.com/feedback";
        this.submitButton = this.form.querySelector("button[type=\"submit\"]");
        this.initializeForm();
    }

    initializeForm() {
        this.form.addEventListener("submit", async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });

        // 添加字数统计
        const description = document.getElementById("description");
        description.addEventListener("input", () => {
            this.updateCharCount(description);
        });
    }

    updateCharCount(textarea) {
        const maxLength = 1000;
        const currentLength = textarea.value.length;
        
        let counter = textarea.parentElement.querySelector(".char-count");
        if (!counter) {
            counter = document.createElement("div");
            counter.className = "char-count";
            textarea.parentElement.appendChild(counter);
        }
        
        counter.textContent = `${currentLength}/${maxLength}`;
        counter.style.color = currentLength > maxLength ? "#ff4444" : "#666";
    }

    async handleSubmit() {
        const formData = {
            type: document.getElementById("type").value,
            description: document.getElementById("description").value,
            contact: document.getElementById("contact").value,
            metadata: {
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                language: navigator.language,
                screenSize: `${window.innerWidth}x${window.innerHeight}`,
                url: window.location.href
            }
        };

        // 基本验证
        if (!this.validateForm(formData)) {
            return;
        }

        try {
            this.setSubmitting(true);
            
            const response = await fetch(this.apiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("提交失败");
            }

            this.showSuccess();
            this.form.reset();
        } catch (error) {
            console.error("提交反馈失败:", error);
            this.showError();
        } finally {
            this.setSubmitting(false);
        }
    }

    validateForm(data) {
        if (!data.description.trim()) {
            this.showError("请填写详细描述");
            return false;
        }

        if (data.description.length > 1000) {
            this.showError("描述内容过长，请精简描述");
            return false;
        }

        if (data.contact && !this.validateEmail(data.contact)) {
            this.showError("请输入有效的邮箱地址");
            return false;
        }

        return true;
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    setSubmitting(isSubmitting) {
        this.submitButton.disabled = isSubmitting;
        this.submitButton.textContent = isSubmitting ? "提交中..." : "提交反馈";
    }

    showSuccess() {
        const message = document.createElement("div");
        message.className = "feedback-message success";
        message.textContent = "感谢您的反馈！";
        
        this.form.parentElement.insertBefore(message, this.form);
        setTimeout(() => message.remove(), 3000);
    }

    showError(message = "提交失败，请稍后重试") {
        const errorMessage = document.createElement("div");
        errorMessage.className = "feedback-message error";
        errorMessage.textContent = message;
        
        this.form.parentElement.insertBefore(errorMessage, this.form);
        setTimeout(() => errorMessage.remove(), 3000);
    }
}

// 初始化反馈处理
document.addEventListener("DOMContentLoaded", () => {
    new FeedbackHandler();
});
