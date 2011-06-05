Ti.include('tiutils.js');
Ti.include('consts.js');

var BaseModel = function () {};
BaseModel.prototype.setObserver = function (observer) {
    if (!this.observers) {
        this.observers = [];
    }
    for (var ob in this.observers) {
        if (ob === observer) {
            return this;
        }
    }
    this.observers.push(observer);
    return this;
};
BaseModel.prototype.removeObserver = function (observer) {
    var len = this.observers;
    for (var i=0; i<len; i++) {
        if (this.observers[i] === observer) {
            this.observers.splice(i, 1);
            return this;
        }
    }
    return this;
};
BaseModel.prototype.notify = function (info) {
    if (this.observers) {
        var obs = this.observers;
        for (var i=obs.length; i--;) {
            var ob = obs[i];
            if (ob.notice) {
                ob.notice(info);
            }
        }
    }
};


var EngineModel = function (pattern, text) {
    try {
        this.pattern = new RegExp(pattern, 'g');
    } catch (x) {
        this.pattern = new RegExp('', 'g');
    }
    this.text = text || '';
    this.match();
};
extend(EngineModel, BaseModel);
EngineModel.prototype.match = function () {
    if (this.text && this.text != '') {
        // var matchRes, i = 0, maxLoop = 50, res = [];
        // while ((matchRes = this.pattern.exec(this.text)) != null) {
        //     var match = {groups: matchRes, index: matchRes.index};
        //     res.push(match);
        //     if (i++ > maxLoop) {break;}
        // }
        // this.notify({result: res});
        if (this.pattern.test(this.text)) {
            var text = this.text.replace(this.pattern, '<span style="background-color:#78B6DF">$&</span>');
            this.notify('<html><body style="font-family:Helvetica Neue;">'.concat(text, '</body></html>'));
        }
    }
};
EngineModel.prototype.setPattern = function (pattern) {
    try {
        this.pattern = new RegExp(pattern, 'g');
        this.match();
    } catch (x) {
        info('exception catched');
    }
};
EngineModel.prototype.setText = function (text) {
    this.text = text;
    this.match();
};
