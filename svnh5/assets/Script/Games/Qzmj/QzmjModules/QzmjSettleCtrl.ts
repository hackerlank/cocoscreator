/*
author: JACKY
日期:2018-01-22 17:10:38
*/
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import ModuleMgr from "../../../Plat/GameMgrs/ModuleMgr";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import QzmjLogic from "../QzmjMgr/QzmjLogic";
import GameDetailresultCtrl from "./Prefab_GameDetailresultCtrl";
import QzmjAudio from "../QzmjMgr/QzmjAudio";
import {g_deepClone} from "../../../Plat/Libs/Gfun";
import { QzmjDef } from "../QzmjMgr/QzmjDef";

let Green = new cc.Color(24,221,40),Red = new cc.Color(255,78,0), Yellow = new cc.Color(255,222,0);
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : QzmjFinishCtrl;
//模型，数据处理
class Model extends BaseModel{
	curcard={};
	opcardarr={};
	cardwallindex=0;
	win_seatid=0;
	lianzhuang=0;
	roomvalue={};
	huacounts=null;
	difans=null;
	scores=null;
	huinfo=null;
	handcards={};
	seatcount=0;
    huafans=null;
    ziangangfans=null;
    normalangangfans=null;
    zigangfans=null;
    normalgangfans=null;
    ziankefans=null;
    normalankefans=null;
    zikefans=null;
    gametimes=0;
    scores={};
    paifansforeach=null;
	constructor()
	{
		super();
	}
	initData()
	{
		let qzmjLogicInstance = QzmjLogic.getInstance();
		if(qzmjLogicInstance != null)
		{
			this.curcard=qzmjLogicInstance.curcard;
			this.opcardarr=qzmjLogicInstance.opcardarr;
			this.cardwallindex=qzmjLogicInstance.cardwallindex;
			this.win_seatid=qzmjLogicInstance.win_seatid;
			this.lianzhuang=qzmjLogicInstance.lianzhuang;
			this.roomvalue=qzmjLogicInstance.roomvalue;
			this.huacounts=qzmjLogicInstance.huacounts;
			this.difans=qzmjLogicInstance.difans;
			this.scores=qzmjLogicInstance.scores;
			this.huinfo=qzmjLogicInstance.huinfo;
			this.handcards=g_deepClone(qzmjLogicInstance.handcards);
			this.seatcount=qzmjLogicInstance.seatcount;
			this.huafans=qzmjLogicInstance.huafans;
			this.ziangangfans=qzmjLogicInstance.ziangangfans;
			this.normalangangfans=qzmjLogicInstance.normalangangfans;
			this.zigangfans=qzmjLogicInstance.zigangfans;
			this.normalgangfans=qzmjLogicInstance.normalgangfans;
			this.ziankefans=qzmjLogicInstance.ziankefans;
			this.normalankefans=qzmjLogicInstance.normalankefans;
			this.zikefans=qzmjLogicInstance.zikefans;
			this.gametimes=qzmjLogicInstance.gametimes;
			this.scores=qzmjLogicInstance.scores;
			this.paifansforeach=qzmjLogicInstance.paifansforeach;
		}
	}
	getJinCount(seatID)
	{
		let handcard= this.handcards[seatID];
		var jincount=0;
		for (var i = 0;i<handcard.length;++i)
		{
			if (handcard[i]==0)
			{
				jincount=jincount+1;
			} 
		} 
		return jincount;
	}
	gethuTypeString()
	{
		// QzmjDef.hutime_zimo			=5;//自摸
		// QzmjDef.hutime_danyou		=6;//单游
		// QzmjDef.hutime_shuangyou	=7;//双游
		// QzmjDef.hutime_sanyou		=8;//三游
		// QzmjDef.hutime_bazhanghua	=9;//八张花
		// QzmjDef.hutime_dianpao		=10;//点炮 
		// QzmjDef.hutime_sanjindao	=11;//三金倒
		// QzmjDef.hutime_qiangganghu	=12;//抢杠胡
		switch (this.huinfo.hutime) {
			case QzmjDef.hutime_zimo:
				return "自摸";
				break;
			case QzmjDef.hutime_danyou:
				return "单游";
				break;
			case QzmjDef.hutime_shuangyou:
				return "双游";
				break;
			case QzmjDef.hutime_sanyou:
				return "三游";
				break;
			case QzmjDef.hutime_bazhanghua:
				return "八张花";
				break;
			case QzmjDef.hutime_dianpao:
				return "点炮";
				break;
			case QzmjDef.hutime_sanjindao:
				return "三金倒";
				break;
			case QzmjDef.hutime_qiangganghu:
				return "抢杠胡";
				break;
			default:
				return null;
				break;
		}
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_score:null,
		node_icon:null,
		node_userList:null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.node.zIndex=101;
		this.initUi();
		this.addGrayLayer();
	}
	//初始化ui
	initUi()
	{
		this.ui.node_userList=[];
		this.ui.node_score = ctrl.node_score;
		this.ui.node_icon = ctrl.node_icon;
		this.ui.node_userList.push(ctrl.node_user_0);
		this.ui.node_userList.push(ctrl.node_user_1);
		this.ui.node_userList.push(ctrl.node_user_2);
		this.ui.node_userList.push(ctrl.node_user_3);
	}
	showUserInfo()
	{
		for (let i = 0; i < this.model.seatcount; ++i) {
			let node_user=this.ui.node_userList[i];
			// 根据logicseatid来获取对应数据
			let logicseatid=RoomMgr.getInstance().getLogicSeatId(i);
			let winloseNode=null;
			let winflag=false;
			if (logicseatid == this.model.win_seatid) {
				node_user.getChildByName("winNode").active = true;
				node_user.getChildByName("loseNode").active = false;
				winloseNode = node_user.getChildByName("winNode");
				winflag=true;
			}
			else
			{
				node_user.getChildByName("winNode").active = false;
				node_user.getChildByName("loseNode").active = true;
				winloseNode = node_user.getChildByName("loseNode");
				winflag=false;
			}
			// 各种水的显示
			let totalPaiFen = this.showfan(node_user,logicseatid);
			// 总计显示
			this.showTotalloseWin(winloseNode,winflag,totalPaiFen,logicseatid);
		}
	}
	showTotalloseWin(winloseNode,winflag,totalPaiFen,logicseatid)
	{
		let finalScore = this.model.scores[logicseatid.toString()];
		if (winflag) {
			winloseNode.getChildByName("difenLabel").getChildByName("difen").getComponent(cc.Label).string = this.model.roomvalue.v_difen;
			winloseNode.getChildByName("lianzhuangLabel").getChildByName("lianzhuang").getComponent(cc.Label).string = Math.pow(2,this.model.lianzhuang);
			winloseNode.getChildByName("paifenLabel").getChildByName("paifen").getComponent(cc.Label).string = totalPaiFen;
			winloseNode.getChildByName("huTypeTimes").getChildByName("times").getComponent(cc.Label).string = this.model.gametimes;
			winloseNode.getChildByName("huTypeTimes").getComponent(cc.Label).string = this.model.gethuTypeString();
			winloseNode.getChildByName("totalFan").getComponent(cc.Label).string = finalScore+"水";
		}
		else{
			// 获取总赢分
			let totalWinScore = this.model.scores[this.model.win_seatid.toString()];
			let paifansforeach = this.model.paifansforeach[logicseatid.toString()];
			winloseNode.getChildByName("huTypeString").getComponent(cc.Label).string = "被"+this.model.gethuTypeString()+"(-"+totalWinScore/3+")";
            winloseNode.getChildByName("huTypeString").color = Red;
			winloseNode.getChildByName("totalFan").getComponent(cc.Label).string = finalScore+"水";
			if (paifansforeach>0) {
                winloseNode.getChildByName("forEachOtherFan").getComponent(cc.Label).string = "三家互算(+"+paifansforeach+"水)";
                winloseNode.getChildByName("forEachOtherFan").color = Yellow;
			}
			else
			{
				winloseNode.getChildByName("forEachOtherFan").getComponent(cc.Label).string = "三家互算("+paifansforeach+"水)";
                winloseNode.getChildByName("forEachOtherFan").color = Red;
			}
			if (finalScore>0) {
                winloseNode.getChildByName("totalFan").color = Yellow;
			}
			else
			{
                winloseNode.getChildByName("totalFan").color = Red;
			}

		}
		if(QzmjLogic.getInstance().win_seatid == null){
			this.ui.node_icon.children[1].active = this.ui.node_icon.children[0].active = false;
			QzmjAudio.getInstance().playLostAudio()
		}else if(QzmjLogic.getInstance().win_seatid != RoomMgr.getInstance().getMySeatId()){
			this.ui.node_icon.children[2].active = this.ui.node_icon.children[0].active = false;
			QzmjAudio.getInstance().playLostAudio()
		}else{
			this.ui.node_icon.children[2].active = this.ui.node_icon.children[1].active = false;
			QzmjAudio.getInstance().playWinAudio();
		}	
	}
	showfan(node_user,logicseatid)
	{
		let totalfan=0;
		let fanDetail = node_user.getChildByName("fanDetail");
		let huafan=this.model.huafans[logicseatid.toString()];
		let ziangangfan=this.model.ziangangfans[logicseatid.toString()];
		let normalangangfan=this.model.normalangangfans[logicseatid.toString()];
		let zigangfan=this.model.zigangfans[logicseatid.toString()];
		let normalgangfan=this.model.normalgangfans[logicseatid.toString()];
		let ziankefan=this.model.ziankefans[logicseatid.toString()];
		let normalankefan=this.model.normalankefans[logicseatid.toString()];
		let zikefan=this.model.zikefans[logicseatid.toString()];
		let jinCount=this.model.getJinCount(logicseatid.toString());
        let strArr = [
            "花牌x", "字暗杠x", "暗杠x",
            "字明杠x", "明杠x", "字暗刻x",
            "暗刻x", "字明刻x", "金牌x"
        ];
        let args = [
            [huafan, huafan], [ziangangfan.count, ziangangfan.fan],[normalangangfan.count, normalangangfan.fan],
            [zigangfan.count, zigangfan.fan], [normalgangfan.count, normalgangfan.fan], [ziankefan.count, ziankefan.fan],
            [normalankefan.count, normalankefan.fan], [zikefan.count, zikefan.fan], [jinCount, jinCount]
        ]
        let index=0;
        let conditionArr = [
            (huafan>0), (ziangangfan.count>0), (normalangangfan.count>0),
            (zigangfan.count>0), (normalgangfan.count>0), (ziankefan.count>0),
            (normalankefan.count>0 && index<6), (zikefan.count>0 && index<6), (jinCount>0 && index<6)
        ]
        for (let i=0; i<9; i++) {
            if (!conditionArr[i]) continue;
            let node = fanDetail.getChildByName("node"+index)
		    node.active = true;
		    node.getComponent(cc.Label).string = strArr[i];
		    node.getChildByName("count").getComponent(cc.Label).string = args[i][0];
		    node.getChildByName("fan").getComponent(cc.Label).string = args[i][1]+"水";
            index++;
			totalfan += args[i][1];
        }
        if(index<=3)
        {
            for(let k=0;k<=3;k++)
            {
                let node = fanDetail.getChildByName("node"+k);
                node.setPosition(node.getPosition().x,node.getPosition().y-16);
            }
        }
		fanDetail.getChildByName("totalShui").getComponent(cc.Label).string = totalfan+"水";
		return totalfan;
	}
}
//c, 控制
@ccclass
export default class QzmjFinishCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property(cc.Node)
	btn_gameInfo:cc.Node = null
	@property(cc.Node)
	btn_share:cc.Node = null
	@property(cc.Node)
	btn_again:cc.Node = null
	@property(cc.Node)
	node_score:cc.Node = null
	@property(cc.Node)
	node_icon:cc.Node = null
	@property(cc.Node)
	btn_close:cc.Node = null
	@property(cc.Node)
	btn_exit:cc.Node = null

	//玩家节点
	@property(cc.Node)
	node_user_0:cc.Node = null
	@property(cc.Node)
	node_user_1:cc.Node = null
	@property(cc.Node)
	node_user_2:cc.Node = null
	@property(cc.Node)
	node_user_3:cc.Node = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
        this.node.zIndex=101
		//数据模型
		this.initMvc(Model,View);
	}

	//定义网络事件
	defineNetEvents()
	{
		this.n_events={
			//网络消息监听列表  
        } 	
	}
	//定义全局事件
	defineGlobalEvents()
	{
		//全局消息
		this.g_events={ 
			'usersUpdated':this.usersUpdated,   
		}
	}
	//绑定操作的回调
	connectUi()
	{
		this.connect(G_UiType.image, this.btn_gameInfo, this.btn_gameInfo_cb,'详细结算信息');
		this.connect(G_UiType.image, this.btn_share, this.btn_share_cb,'微信分享' );
		this.connect(G_UiType.image, this.btn_again, this.btn_again_cb, '再来一局');
		this.connect(G_UiType.image, this.btn_close, this.btn_close_cb, '关闭');
		this.connect(G_UiType.image, this.btn_exit, this.btn_exit_cb, '退出');
	}
	start () {
		this.model.initData();
		this.view.showUserInfo();
	}
	//网络事件回调begin
	usersUpdated(){
		this.finish();
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	btn_gameInfo_cb(){
		console.log("btn_gameInfo_cb");
		this.start_sub_module(G_MODULE.gameDetailResult, (prefabComp:Prefab_gameDetailResultCtrl)=>{
			console.log("btn_gameInfo_cb11111");
            prefabComp.showDetailResult();
        }));
	}
	btn_share_cb(){
		
	}
	btn_again_cb(){
		RoomMgr.getInstance().onceMore();
	}
	btn_close_cb(){
		RoomMgr.getInstance().backToRoom();  
	}
	btn_exit_cb(){
		//退出房间
	}
	//end
}
