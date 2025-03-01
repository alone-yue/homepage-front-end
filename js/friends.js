var friends = new Vue({
	el:".friends",
	data:{
		friendLink:[],
		friendForm:{
			address:'',
			name:''
		},
		bgm:{
			paused:true,
			containerClass:'friends-player-container-paused',
			maskControlClass:'friends-player-mask-control-paused'
		}
	},
	methods:{
		loadFriendLink:function(){//加载友链列表
			console.log('blog page is loading friend links');
			var that = this;
			$.ajax({
				async:false,
				url:getPath() + '/friendlink/getAccept.action',
				type:'GET',
				crossDomain:true,
				success:function(result){
					console.log('friend link load successfully');
					that.friendLink = result;
				},
				error:function(e){
					console.log('失败了');
						
					console.log(e);
				}
			});
		},
		addFriendLink:function(){
			var that = this;
			$.ajax({
				async:false,
				url:getPath() + '/friendlink/leave.action',
				type:'POST',
				crossDomain:true,
				data:that.friendForm,
				success:function(result){
					if(result.code == 1){
						alert('error ' + result.error);
						return;
					}else{
						alert('提交成功，感谢支持，博主会尽快添加的，请保持主页可访问哦');
						that.friendForm = {
							name:'',
							address:''
						};
					}
				}
			})
		},
		bgmControl:function(){//控制背景音乐
			var audio1 = document.getElementById('audio1');
			var audio2 = document.getElementById('audio2');
			if(this.bgm.paused){//背景音乐播放，开始下雨
				audio1.play();
				audio2.play();
				this.bgm = {
					paused:false,
					containerClass:'friends-player-container-playing',
					maskControlClass:'friends-player-mask-control-playing'
				}
				currLevel = 0;
				$('.rain-controller-up').click();
				setRefresh();
				$('.rain-controller').show();
			}else{				//背景音乐暂停，停止下雨
				audio1.pause();
				audio2.pause();
				this.bgm = {
					paused:true,
					containerClass:'friends-player-container-paused',
					maskControlClass:'friends-player-mask-control-paused'
				}
				
				ctx.clearRect(0,0,canvas.width,canvas.height);
				clearRefresh();
				$('.rain-controller').hide();
			}
		}
	},
	created:function(){
		
		this.loadFriendLink();
		
	}
})

$(function(){
	var audio1 = document.getElementById('audio1');
	var audio2 = document.getElementById('audio2');
	
	setTimeout(function(){
		
		audio2.currentTime = 2.5;
		
		$('#audio1').on('ended',function(){
			audio1.play();
		})
		
		$('#audio2').on('ended',function(){
			audio2.play();
		})
		
		// $('.friends-player-mask').click();
	});
	
})

let canvas = document.getElementById('canvas');

let ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

class Rain{
	constructor() {
	    this.x = Math.random() * window.innerWidth;
		this.y = Math.random() * window.innerHeight;
		this.speedX = Math.random() * 3 - 5;
		this.speedY = Math.random() * 5 + 10;
	}
	
	update(){
		this.x = (this.x + this.speedX + canvas.width) % canvas.width;
		this.y = (this.y + this.speedY) % canvas.height;
	}
	
	draw(){
		ctx.strokeStyle = 'silver';
		ctx.beginPath();
		ctx.moveTo(this.x,this.y);
		ctx.lineTo(this.x + this.speedX,this.y + this.speedY);
		ctx.stroke();
	}
}

let rains = [];
let currLevel = 1;
for(let i = 0;i < 3000;i++){
	rains.push(new Rain());
}

let canvasRefreshId = null;

function setRefresh(){
	canvasRefreshId = setInterval(function(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		for(let i = 0;i < 1000 * currLevel;i++){
			rains[i].update();
			rains[i].draw();
		}
	},20);
}

function clearRefresh(){
	clearInterval(canvasRefreshId);
}


$('.rain-controller-up').click(function(){
	currLevel = currLevel + 1 > 3 ? 3 : currLevel + 1;
	$('.rain-controller-panel').text('当前降水量:' + currLevel);
	
	
});

$('.rain-controller-down').click(function(){
	currLevel = currLevel - 1 < 0 ? 0 : currLevel - 1;
	$('.rain-controller-panel').text('当前降水量:' + currLevel);
	
	if(currLevel == 0){
		friends.bgmControl();
	}
});
