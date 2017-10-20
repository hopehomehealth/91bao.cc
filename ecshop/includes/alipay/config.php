<?php
$config = array (	
		//应用ID,您的APPID。
		'app_id' => "2016080500169390",

		//商户私钥
		'merchant_private_key' => "MIIEpAIBAAKCAQEAviSIHi5X+0YTuG8wiHgXXHJ/a7B1OKP+PHlxQt7GKl9Gaocpeecn/GX2gRrHYJEdls75+pURpuiXwF8WqOuSltfZolFhRc389hDudvq4Gh7YJYtTPPK5w6+wdF+2Gf/lpC2tHeWrSpDIp3+rzrNstJN3nB6O+ChWlvxtMSvC8mWdNnLRgZJoEVMY5QPnoCRloTOaVu6LmkN150Yk5eOQjit4q4M7Bdl/Wfz1QNeY+Nrrb3t6EynxXqIt+PlrckV+wE6K9SME3uNroLqbrDjBiwpGlrSzpZh9ZmEzaLPcZ+ca32bTpe8C95vCFnco7EPPCVthxE6sz0SBBLF0OJWL0wIDAQABAoIBAQCczoXO1gtKtuUGgfP1Z4xkeixpBBH3zw6YktJ8AjpMsVvh+GuVE7PfK7tZh1sLYUGUoEZ5h7wR+NlFFWYbkoLGkWXyvchJh/Hof9gZGPUA3ZUFiVvw9H+MSPRtVI1Z7bZVajHNaR2VFcfUkq5+fWvVk5PdlTn0n1ehlrT6CwvvV73jjLS7w+VYyCHOoDavSv8k9Ls9Tg71uW3yd1goLJFn/5L8JZptRj1y0i0rrlSH/swpxpjHnKBxlFD5ltZ61ezk5xsvK0AuQOKpCElbhW/abEGsR9rLwsYIvTsbGMAw10Gc6HYXnmJAXvRBcSTNRp44Uoatl19V7L+O6c3nDstZAoGBAPNcdcU4D2VhDp5lSEdeWxLonf4qvk6HyNo5I8HfVy18j6tFQocTYGMBpTMP39zHlPdw5uv+ZSMlskuAEJVCybr0IFmR30Fe0R3DGFvfIdSA1Ei2aJ9hCwwQOj/5nKnRzsvDXIdd5vC+5m+CUmf+OmnKNa/VzoGc3AcVUmvBrpz/AoGBAMgEhT5NuXA+SblRL6I/qnnoRL7eQC5GqREBuYsm2UOoV5OAFV6fTyLZIhtffQgzDrHpQwykf+DGVyeOa10Cl7UZxV8DqKNFGuMnpf+v6u4yP7+pshiZT8Sn7ILhgRovaF6zoqWE1U84iWuuToeJ+nfS74glB0MdjDKVkC+SFQ0tAoGBAKWvfnMObtT71mMa27HTWLgv7VkdKsH2ilWgb2rQLt9GHd5iYh/qnkXp2dpA5Y2/x/kLQfzMD3l1ccUbZK7qcMO678drnA86ia70o8Hw0WyHZYA3yFUyUb4d0jq6K+ImeN+bm4SB9vhTUDn9BTPOD2D1DcYwD8+Ixvh/mMTKcaJrAoGAc/dS/W1431/txJkSggJhp66H9RXMpkfni+mxFsGeZAC9TdKMEUFSU4UKpk41osRfd70jV7gkQEEelNuY2eM/7AsWCOGJK6hMT3lUYCsxjYrqtQgBLwvsWLt3f+aYwILOA2IpIcgjGHxSCHGWLDVOV5yfrhKx5DLEbyuR3lLXC70CgYAcQhZFnMUT5RjArM1xQRcXEzdcaPiL954uYrVa2jOoH2yMEGLRxeJ2VDLEipa0N4iNcHL5tq/q6gjcJ4L26ToQp0L0sivWgdzcN9N0E6eyqTZSk1SymrjMslpK7BfPlismGA51gfkjLA5yy17SUFtzr/CobHkyNXmLjJf5NK5tuw==",
		
		//异步通知地址
		'notify_url' => "https://sekia.xin/includes/alipay/notify_url.php",
		
		//同步跳转
		'return_url' => "https://sekia.xin/includes/alipay/return_url.php",

		//编码格式
		'charset' => "UTF-8",

		//签名方式
		'sign_type'=>"RSA2",

		//支付宝网关
		'gatewayUrl' => "https://openapi.alipaydev.com/gateway.do",

		//支付宝公钥,查看地址：https://openhome.alipay.com/platform/keyManage.htm 对应APPID下的支付宝公钥。
		'alipay_public_key' => "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArdkQhRlCnolh6YPjjBYH0/FVrcpmxCfRLt5chptA9gmW+uD+7hxQw3a7pB2fuU3IM0rbhM1HRohHMe1S75SwS5fxJebceUl+zuGXL66ejTCYjei3u9bMfwlYQw4HnVa1xhjQl+4VzF6BDnlZ3sKr0nvT79omUjaDhQXF/O8tdhqiUCsvqpPFH3CZzfT98ID9W+c85r8nJHf9+0X+VgrFthTw9oT8y6mwacYiI96/01A2PLWxB6CSYlizpWDKmfZdVPGHwxnQNFIPy4hTQUSsJE30MRrzLLdOxCSYLl+JHWX+iOOV8O8rENWqyamMJq+wGcBWtxO8AWKWhJ9mJL/X4wIDAQAB",
);