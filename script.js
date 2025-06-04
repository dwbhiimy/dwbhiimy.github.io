// 模拟文件上传函数
function simulateUpload(file, progressCallback, completeCallback) {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressCallback(progress);
        if (progress >= 100) {
            clearInterval(interval);
            completeCallback();
        }
    }, 500);
}

// 生成随机的 user_id 函数，移到事件监听器外部
const generateRandomUserId = () => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let userId = '';
    const length = 10; // 可根据需要调整长度
    for (let i = 0; i < length; i++) {
        userId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return userId;
};

// 处理文件上传
// 修改上传按钮事件处理
document.getElementById('uploadButton').addEventListener('click', async function() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const fileInfoDiv = document.getElementById('fileInfo');
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadSuccessMessage = document.getElementById('uploadSuccessMessage');

    if (file) {
        // 移除显示文件信息的代码
        // fileInfoDiv.textContent = `文件名: ${file.name}, 文件类型: ${file.type}`;
        
        // 上传到COS并暂存URL
        tempFileUrl = await uploadToCOS(file);
        
        // 移除模拟上传过程，避免重复显示成功消息
        // simulateUpload(file, 
        //     (progress) => {
        //         uploadProgress.value = progress;
        //     },
        //     () => {
        //         console.log('文件上传完成');
        //         // 显示上传成功弹窗
        //         uploadSuccessMessage.textContent = '上传成功';
        //         uploadSuccessMessage.classList.add('show');
        //         // 一段时间后隐藏弹窗
        //         setTimeout(() => {
        //             uploadSuccessMessage.classList.remove('show');
        //         }, 3000);
        //     }
        // );
    } else {
        alert('请选择一个文件');
    }
});

// 处理生成建议
// 在文件顶部添加COS配置
const cosConfig = {
  SecretId: 'AKIDBF6nJemgOvISfkcGl4B5lIenjW8WlpkX',
  SecretKey: 'iIjy89ye8ar21oNjwyNbgZFi0AB1gCWd',
  Bucket: 'improver-1361787677',
  Region: 'ap-guangzhou'
};

// 添加COS上传函数
async function uploadToCOS(file) {
  const uploadProgress = document.getElementById('uploadProgress');
  const fileInfo = document.getElementById('fileInfo');
  // 显示进度条
  uploadProgress.style.display = 'block';
  uploadProgress.value = 0;

  return new Promise((resolve, reject) => {
    const cos = new COS({
      SecretId: cosConfig.SecretId,
      SecretKey: cosConfig.SecretKey
    });
    
    const key = `resumes/${Date.now()}_${file.name}`;
    cos.putObject({
      Bucket: cosConfig.Bucket,
      Region: cosConfig.Region,
      Key: key,
      Body: file,
      onProgress: function(progressData) {
        // 更新进度条
        const percent = Math.round(progressData.percent * 100);
        uploadProgress.value = percent;
        
        // 实时显示上传百分比
        fileInfo.innerHTML = `文件名称: ${file.name}<br>文件大小: ${formatFileSize(file.size)}<br>上传进度: ${percent}%`;
      }
    }, function(err, data) {
      if (err) {
        console.error('上传失败:', err);
        fileInfo.innerHTML = `上传失败: ${err.message}`;
        // 移除隐藏进度条的代码
        // uploadProgress.style.display = 'none';
        reject(err);
      } else {
        console.log('上传成功:', data);
        uploadProgress.value = 100;
        showUploadSuccess('文件上传成功！');
        
        // 移除3秒后重置上传状态的代码
        // setTimeout(() => {
        //   uploadProgress.style.display = 'none';
        //   fileInfo.innerHTML = '';
        // }, 3000);
        resolve(`https://${cosConfig.Bucket}.cos.${cosConfig.Region}.myqcloud.com/${key}`);
      }
    });
  });
}

// 格式化文件大小
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 显示上传成功消息
function showUploadSuccess(message) {
  const uploadSuccessMessage = document.getElementById('uploadSuccessMessage');
  uploadSuccessMessage.textContent = message;
  uploadSuccessMessage.classList.add('show');
  
  // 3秒后自动隐藏
  setTimeout(() => {
    uploadSuccessMessage.classList.remove('show');
  }, 3000);
}

// 添加全局变量用于存储动图元素
let gifElement = null;

// 创建动图元素并设置样式
function createGifElement(src) {
    if (gifElement) {
        gifElement.remove();
    }
    gifElement = document.createElement('video');
    gifElement.src = src;
    gifElement.autoplay = true;
    gifElement.loop = true;
    gifElement.muted = true;
    gifElement.style.position = 'fixed';
    gifElement.style.left = '0';
    gifElement.style.bottom = '0';
    gifElement.style.maxWidth = '200px'; // 放大一倍，原 200px
    document.body.appendChild(gifElement);
}

// 检查改进建议文字框中的内容
function checkSuggestions() {
    const improvementSuggestionsDiv = document.getElementById('improvementSuggestions');
    const content = improvementSuggestionsDiv.textContent;
    const triggers = [
        { text: '以下是银灰先生的评价', src: 'D:\\跟他丫的爆了\\银灰-不融冰-基建-Relax-x0.8.webm' },
        { text: '以下是凯尔希医生的评价', src: 'D:\\跟他丫的爆了\\凯尔希-默认-基建-Relax-x1.webm' },
        { text: '以下是赫默医生的评价', src: 'D:\\跟他丫的爆了\\赫默-默认-基建-Relax-x1.webm' },
        { text: '以下是梓兰小姐的评价', src: 'D:\\跟他丫的爆了\\梓兰-默认-基建-Relax-x1.webm' },
        { text: '以下是杜宾教官的评价', src: 'D:\\跟他丫的爆了\\杜宾-默认-基建-Relax-x1.webm' },
        { text: '蜜饼', src: 'D:\\跟他丫的爆了\\刻俄柏-默认-基建-Sleep-x1.webm' }
    ];

    for (const trigger of triggers) {
        if (content.includes(trigger.text)) {
            createGifElement(trigger.src);
            return;
        }
    }

    if (gifElement) {
        gifElement.remove();
        gifElement = null;
    }
}

// 修改generateButton事件处理函数，在获取到建议后调用检查函数
document.getElementById('generateButton').addEventListener('click', async function() {
    const requirement1 = document.getElementById('requirement1').value;
    const requirement2 = document.getElementById('requirement2').value;
    const improvementSuggestionsDiv = document.getElementById('improvementSuggestions');
    const generateButton = document.getElementById('generateButton');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.textContent = '正在生成建议，请等待大约30秒哦博士...';
    improvementSuggestionsDiv.innerHTML = '';
    improvementSuggestionsDiv.appendChild(loadingDiv);

    if (tempFileUrl && (requirement1 || requirement2)) {
        try {
            // 显示加载状态
            generateButton.disabled = true;
            generateButton.textContent = '生成中...';

            const response = await fetch('https://api.coze.cn/v3/chat', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer pat_ck4o8Et7tN5EGgY1AcGsQGsNNPufs3fz1IIzsLgiXudbke1oT22s8G4o4mXLNK3W',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "bot_id": "7509396679938916379",
                    "user_id": generateRandomUserId(),
                    "stream": false,
                    "auto_save_history": true,
                    "additional_messages": [
                        {
                            "role": "user",
                            "content": `文件 URL: ${tempFileUrl}, 改进建议 1: ${requirement1}, 改进建议 2: ${requirement2}`,
                            "content_type": "text"
                        }
                    ]
                })
            });

            const data = await response.json();
            console.log('API完整响应:', JSON.stringify(data, null, 2));

            // 检查响应格式
            if (!data || typeof data !== 'object') {
                throw new Error('无效的API响应格式');
            }

            // 检查响应code是否为0
            if (data?.code !== 0) {
                console.error('API请求失败:', data?.message || '未知错误');
                loadingDiv.remove();
                alert(`生成失败: ${data?.message || '未知错误'}`);
                return;
            }

            // 获取chat_id和conversation_id
            const chatId = data['data']['id'];
            const conversationId = data['data']['conversation_id'];

            if (!chatId || !conversationId) {
                console.error('缺少必要参数:', {chatId, conversationId});
                loadingDiv.remove();
                alert('生成失败: 缺少必要参数');
                return;
            }

            // 轮询配置
            let checkCount = 0;
            const maxChecks = 40; // 最大轮询次数
            const authHeader = 'Bearer pat_ck4o8Et7tN5EGgY1AcGsQGsNNPufs3fz1IIzsLgiXudbke1oT22s8G4o4mXLNK3W';

            const checkStatus = async () => {
                checkCount++;
                console.log(`轮询检查 #${checkCount}`);
            
                if (checkCount >= maxChecks) {
                    console.error('轮询超时');
                    loadingDiv.remove();
                    improvementSuggestionsDiv.innerHTML = '<div class="error">生成超时，请稍后重试</div>';
                    return;
                }
            
                try {
                    const statusResponse = await fetch(
                        `https://api.coze.cn/v3/chat/message/list?chat_id=${chatId}&conversation_id=${conversationId}`,
                        { headers: { 'Authorization': authHeader } }
                    );
                    const statusData = await statusResponse.json();
                    console.log(`轮询响应 #${checkCount}:`, statusData);
            
                    // 关键修改：等待最终的 AI 建议消息
                    const finalSuggestion = statusData.data?.find(item => 
                        item.type === 'answer' && 
                        item.role === 'assistant' && 
                        !item.content.startsWith('{') // 排除 JSON 格式的中间结果
                    );
            
                    if (finalSuggestion) {
                        improvementSuggestionsDiv.innerHTML = marked.parse(finalSuggestion.content);
                        loadingDiv.remove();
                        // 检查建议内容
                        checkSuggestions();
                        return;
                    }
            
                    // 继续轮询
                    setTimeout(checkStatus, 1000);
                } catch (error) {
                    console.error('轮询出错:', error);
                    loadingDiv.remove();
                    improvementSuggestionsDiv.innerHTML = '<div class="error">获取建议时出错</div>';
                }
            };

            // 开始第一次轮询
        // 开始第一次轮询
            checkStatus();

        } catch (error) {
            console.error('初始化失败:', error);
            improvementSuggestionsDiv.innerHTML = '<div class="error">初始化请求失败</div>';
        } finally {
            generateButton.disabled = false;
            generateButton.textContent = '生成改进建议';
        }
    } else {
        alert(tempFileUrl ? '请至少输入一个改进要求' : '请先上传文件');
    }
});

// 添加全局变量暂存文件URL
let tempFileUrl = null;

// 添加点击背景掉落图片的功能
document.body.addEventListener('click', function(event) {
    // 排除点击功能框和右下角图片的情况
    if (event.target.id === 'functionalBox' || event.target.id === 'hoverImage') {
        return;
    }

    // 定义图片列表和对应的概率
    const images = [
        { src: 'D:/跟他丫的爆了/热水壶.png', weight: 50 },
        { src: 'D:/跟他丫的爆了/人事部铜印.png', weight: 20 },
        { src: 'D:/跟他丫的爆了/人事部密信.png', weight: 20 },
        { src: 'D:/跟他丫的爆了/博士银印.png', weight: 10 }
    ];

    // 根据概率随机选择图片
    let random = Math.random() * 100;
    let selectedImage;
    for (const image of images) {
        if (random < image.weight) {
            selectedImage = image.src;
            break;
        }
        random -= image.weight;
    }

    // 创建图片元素
    const img = document.createElement('img');
    img.src = selectedImage;
    img.style.position = 'absolute';
    img.style.left = event.clientX + 'px';
    img.style.top = event.clientY + 'px';
    img.style.width = '100px'; // 可根据需要调整图片大小
    img.style.transition = 'top 1.5s ease-in'; // 加速掉落速度

    // 将图片添加到页面
    document.body.appendChild(img);

    // 模拟掉落动画
    setTimeout(() => {
        img.style.top = window.innerHeight - img.offsetHeight + 'px';
    }, 10);

    // 动画结束后等待 1 秒，然后添加渐隐类
    img.addEventListener('transitionend', function() {
        setTimeout(() => {
            img.style.transition = 'opacity 1s ease-in'; // 渐隐动画持续时间 1 秒
            img.style.opacity = '0';
            // 渐隐动画结束后移除图片
            img.addEventListener('transitionend', function() {
                document.body.removeChild(img);
            }, { once: true });
        }, 1000);
    });
});

// 定义提示信息数组
const resumeTips = [
    "建议使用具体数据呈现成果，例如\"提升30%效率\"比笼统表述更具说服力。",
    "使用动词开头描述经历，如\"策划\"\"主导\"\"优化\"等。",
    "建议将核心技能放在简历前1/3位置，便于HR快速了解。",
    "针对不同岗位需求调整简历内容更为合适。",
    "按时间倒序排列工作经历，便于查看最新经历。",
    "量化工作成果，如\"节省成本20万\"等具体数据。",
    "简历表述建议使用\"负责项目\"等客观句式。",
    "建议在简历中适当加入招聘要求中的关键词。",
    "应届生可用课程项目和社团经历补充工作经验部分。",
    "简历长度建议：应届生1页，资深人士不超过2页。",
    "推荐使用Arial或Times New Roman等标准字体。",
    "保持适当页面留白更利于阅读。",
    "建议使用PDF格式投递简历以避免格式问题。",
    "简历文件命名建议采用\"姓名_应聘职位.pdf\"格式。",
    "保持格式对齐，如日期右对齐，公司名左对齐。",
    "非设计岗位建议使用黑白配色方案。",
    "斜体字建议谨慎使用，避免影响阅读。",
    "使用粗体标题划分不同内容板块。",
    "建议避免使用表格格式，ATS系统可能无法识别。",
    "建议使用专业邮箱地址。",
    "联系电话建议包含区号。",
    "如有相关，可提供LinkedIn或作品集链接。",
    "简历标题可直接使用姓名。",
    "兴趣爱好建议选择与岗位相关的项目。",
    "建议将技能分类呈现。",
    "语言能力建议明确说明熟练程度。",
    "证书建议标注获得时间。",
    "可单独列出项目经验补充工作经历。",
    "GPA3.5/4.0以上建议注明。",
    "建议仔细检查简历中的拼写错误。",
    "简历中无需说明离职原因。",
    "能力描述建议配合具体实例。",
    "除非招聘方要求，否则不建议注明期望薪资。",
    "国内简历可选择性添加照片，国外简历通常不放。",
    "建议用具体项目成果替代主观评价。",
    "简历内容建议保持积极正面。",
    "专业术语缩写建议注明全称。",
    "职业空窗期可用\"自由职业\"或\"学习提升\"说明。",
    "转行者建议突出可迁移技能。",
    "应届生可用校园经历补充工作经历部分。",
    "投递海外简历需注意当地习惯。",
    "创意岗位可准备视觉简历，但需附普通版本。",
    "学术岗位建议突出研究成果。",
    "管理岗位建议注明团队规模和预算等信息。",
    "短期工作经历可考虑合并呈现。",
    "创业经历可作为能力证明。",
    "相关志愿者经历可考虑加入简历。",
    "建议定期更新简历内容。"
];

let currentTipIndex = 0;
const tipsElement = document.getElementById('resumeTips');

// 切换提示信息的函数
function changeTip() {
    tipsElement.textContent = resumeTips[currentTipIndex];
    currentTipIndex = (currentTipIndex + 1) % resumeTips.length;
}

// 初始显示第一条提示信息
changeTip();

// 每5秒切换一次提示信息
setInterval(changeTip, 5000);