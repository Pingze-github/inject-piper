# inject-piper
A node.js server that can pipe web page to client, and inject code to the page at the same time. It works like a extention of browser, and works on mobile browser as well. The project was created to make up the problem that mobile browser not supports extention, it let the moblie terminal users to change web pages' content, style, and behavior.
 
这是一个node.js服务器，可以作为中转将网页传递给客户端，同时在网页中注入代码。这像一个浏览器扩展一样工作，并且在移动端浏览器上一样有效。这个项目是为了拟补目前移动端浏览器不支持扩展的问题而创建的，可以使移动端也能更改网页的内容、样式和行为。

### 已实现的功能
+ http://server/pipe?href= 后填入网址，可以成功通过服务器中转单次请求。
+ 请求的文档在服务端被处理，大部分相对资源（包括css/js/svg/jpg等）链接被绝对化，仍可以在不同域下获取。
+ 所有相对跳转链接（主要指a标签）被绝对化。所有跳转链接增添 http://server/pipe?href= 前缀。
+ 完善的网页编码自识别机制，避免乱码。
+ 合理的超时/重连机制，提高访问效率。

### 待实现的功能
+ 反反盗链。
+ 在客户端添加和管理不同域名下的注入代码。
+ 支持javascript代码产生的跳转。
+ 支持javascript代码生成的url的转换。
+ 支持css代码中的url的转换。
+ 避免域更改导致的js代码错误。
+ 识别部分不包含关键字的资源url（如```<img src='http://qidian.qpic.cn/qidian_common/349573/0305ff0dee1e098c90ed88cb464aec3b/0'>```）。
+ 主页（带网址输入框）。
+ 链接最终失败时展示的页面。
