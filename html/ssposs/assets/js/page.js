function Page(options) {
	var that = this;
	this.data = {};
	this.currPage = 0;
	this.pageSize = 10;
	this.totalSize = 0;
	this.url = '';
	this.prevBtnId = '#prevBtn';
	this.nextBtnId = '#nextBtn';
	this.currentPageId = '#currentPage';
	this.pageSizeId = '#pageSize';
	this.totalSizeId = '#totalSize';
	this.success = function() {};
	this.falid = function() {};

	$.each(options || {}, function(i, item) {
		that[i] = item;
	})

	this.$prevBtn = $(this.prevBtnId);
	this.$nextBtn = $(this.nextBtnId);
	this.$currentPage = $(this.currentPageId);
	this.$pageSize = $(this.pageSizeId);
	this.$totalSize = $(this.totalSizeId);
	this.init();
}
Page.prototype = {
	init: function() {
		this.$nextBtn.prop('disabled', false);
		this.$nextBtn.prop('disabled', false);
		this.load();
		this.bindEvent();
	},
	load: function() {		
		var that = this;
		var queryData = that.data;
		queryData.pageIndex = that.currPage;
		queryData.pageSize = that.pageSize;
		fx.request(that.url, queryData, function(res){
			window.scrollTo(0, 0);
			that.totalSize = res.totalSize;
			that.success(res.list);
			that.$currentPage.html(that.currPage + 1);
			that.$pageSize.html(that.pageSize);
			that.$totalSize.html(that.totalSize);
			if ((that.currPage + 1) * that.pageSize >= that.totalSize) {
				that.$nextBtn.prop('disabled', true);
			}			
		}, that.failed);

		if (that.currPage === 0) {
			that.$prevBtn.prop('disabled', true);
		}
	},
	bindEvent: function() {
		this.$prevBtn.on('click', $.proxy(this.last, this));
		this.$nextBtn.on('click', $.proxy(this.next, this));
	},
	last: function() {
		if (this.currPage > 0) {
			this.currPage -= 1;
			this.load();
		}
		this.$nextBtn.prop('disabled', false);
	},
	next: function() {
		if (this.totalSize > (this.pageSize * (this.currPage + 1))) {
			this.currPage += 1;
			this.load();
		}
		this.$prevBtn.prop('disabled', false);
	},
	initQueryData: function(data) {
		this.currPage = 0;
		this.totalSize = 0;
		this.data = data;
	}
}