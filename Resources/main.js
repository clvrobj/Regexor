Ti.include('tiutils.js');
Ti.include('consts.js');
Ti.include('model.js');

var MainWinMgr = function () {
    var mgr = this;
    var font = {fontFamily:'Helvetica Neue', fontSize: 18, fontWeight: 'normal'};

    // use a scroll view to let view level up when kbd show up    
    var leftView = Ti.UI.createScrollView(
        {left: 0, width: 360, height: 300,
         contentWidth: 'auto',contentHeight: 'auto',
	     showVerticalScrollIndicator:true});
    var mainView = Ti.UI.createView(
        {layout: 'vertical', width: 360, height: 300, backgroundColor: 'red'});

    var regexView = Ti.UI.createView(
        {top: 0, width: 360, height: 100});
    var regexinputDoneBtn = Titanium.UI.createButton(
        {systemButton:Titanium.UI.iPhone.SystemButton.DONE});
    var regexInput = Ti.UI.createTextArea(
        {hintText: 'Regex string', top: 5, width: 360, height: 90, backgroundColor: '#888',
         font: font,
         autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
         keyboardToolbar: [regexinputDoneBtn], keyboardToolbarColor: '#757D8A'});
    regexinputDoneBtn.addEventListener('click', function () {regexInput.blur();});
    regexView.add(regexInput);
    regexInput.addEventListener('change',
                                function (e) {
                                    mgr.model.setPattern(e.source.value);
                                });
    this.regexView = regexView;
    this.regexView.input = regexInput;

    var resultView = Ti.UI.createView(
        {top: 0, width: 360, height: 200});
    var doneBtn = Titanium.UI.createButton(
        {systemButton:Titanium.UI.iPhone.SystemButton.DONE});
    var dataInput = Ti.UI.createTextArea(
        {hintText: 'Data string', top: 5, width: 360, height: 190, backgroundColor: 'green',
         font: font,
         suppressReturn: false,
         keyboardToolbar: [doneBtn],
         keyboardToolbarColor: '#757D8A'});
    doneBtn.addEventListener('click', function () {dataInput.blur();});
    dataInput.addEventListener('blur',
                               function (e) {
                                   setStopStrokeTimer(e.value);
                               });
    resultView.add(dataInput);

    var stopStrokeTime = 1.7 * 1000;
    var stopStrokeHandler = function (text) {
        mgr.model.setText(text);
    };
    var setStopStrokeTimer = function (text) {
        clearTimeout(mgr.resultView.tHandle);
        var proxyFunc = function () {
            return function () {stopStrokeHandler(text);};
        };
        mgr.resultView.tHandle = setTimeout(proxyFunc(), stopStrokeTime);
    };

    dataInput.addEventListener('change',
                                function (e) {
                                    setStopStrokeTimer(e.value);
                                });
    resultView.input = dataInput;
    this.resultView = resultView;

    mainView.add(regexView);
    mainView.add(resultView);
    leftView.add(mainView);

    var rightScrollView = Ti.UI.createScrollView(
        {left: 360, width: 120, height: 300,
         contentWidth: 'auto',contentHeight: 'auto',
	     showVerticalScrollIndicator:true});
    var rowHeight = 60,
    toolsTableView = Ti.UI.createTableView(
        {width: 120, height: 300, backgroundColor: '#E5F0FA'});
    toolsTableView.addEventListener('scroll', function () {
                                        regexInput.blur();
                                    });
    var shortcuts = shortcutsData,
    clickShortcut = function (e) {
        var text = mgr.regexView.input.value || '';
        text = text.concat(shortcuts[e.index].text);
        mgr.regexView.input.value = text;
        mgr.regexView.input.focus();
    };
    for (var i=0, len=shortcuts.length; i<len; i++) {
        var data = shortcuts[i],
        r = Ti.UI.createTableViewRow({width: 120, height: rowHeight}),
        v = Ti.UI.createView({layout: 'vertical', width: 110, height: rowHeight - 10}),
        title = Ti.UI.createLabel(
            {text: data.text, width: 100, height: 23, color:'#346091',
             font: {fontSize: 18}});
        v.add(title);
        if (data.hint && data.hint != '') {
            var hint = Ti.UI.createLabel(
                {text: data.hint, width: 100, height: 27, color: '#7F7F7F',
                 font: {fontSize: 12}});
            v.add(hint);
        }
        r.add(v);
        r.addEventListener('click', clickShortcut);
        toolsTableView.appendRow(r);
        rightScrollView.add(toolsTableView);
    }

    this.window = Ti.UI.createWindow(
        {navBarHidden: true, tabBarHidden: true});
    
    this.window.add(leftView);
    this.window.add(rightScrollView);

    this.model = new EngineModel('', '');
    this.model.setObserver(this);
};
MainWinMgr.prototype.init = function () {
    debug('main window init ok');
    var window = this.window, keepOrientation = function () {
        // enforce landscape for this window
	    Ti.UI.orientation = Titanium.UI.LANDSCAPE_RIGHT;
    };
    this.window.addEventListener('focus', keepOrientation);
    this.window.open();
    return this;
};
MainWinMgr.prototype.notice = function (data) {
    this.showResult(data);
};
MainWinMgr.prototype.showResult = function (resHtml) {
    if (this.resultView) {
        if (!this.resultView.render) {
            var mgr = this, render = Ti.UI.createWebView({});
            render.addEventListener('click',
                                    function () {
                                        mgr.resultView.render.hide();
                                        mgr.resultView.input.focus();
                                    });
            this.resultView.render = render;
            this.resultView.add(this.resultView.render);
        }
        this.resultView.render.html = resHtml;
        this.resultView.input.blur();
        this.resultView.render.show();
    }
};