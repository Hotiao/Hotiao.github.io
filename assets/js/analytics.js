class DownloadAnalytics {
    constructor() {
        this.apiEndpoint = "https://api.hotiao.com/stats";
        this.initialized = false;
        this.downloadButtons = {
            windows: document.getElementById("windows-download"),
            android: document.getElementById("android-download")
        };
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;

        // 添加下载事件监听
        Object.entries(this.downloadButtons).forEach(([platform, button]) => {
            if (button) {
                button.addEventListener("click", (e) => {
                    this.trackDownload(platform);
                });
            }
        });
    }

    async trackDownload(platform) {
        try {
            const data = {
                platform,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                language: navigator.language,
                referrer: document.referrer
            };

            // 发送统计数据
            const response = await fetch(this.apiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error("统计数据上报失败");
            }

            console.log(`下载事件已记录: ${platform}`);
        } catch (error) {
            console.error("统计数据上报失败:", error);
        }
    }

    // 获取下载统计数据
    async getStats() {
        try {
            const response = await fetch(`${this.apiEndpoint}/summary`);
            if (!response.ok) {
                throw new Error("获取统计数据失败");
            }
            
            const data = await response.json();
            return {
                totalDownloads: data.total,
                platformStats: data.platforms,
                timeStats: data.timeline
            };
        } catch (error) {
            console.error("获取统计数据失败:", error);
            return null;
        }
    }
}

// 初始化下载统计
const analytics = new DownloadAnalytics();
document.addEventListener("DOMContentLoaded", () => analytics.init());
