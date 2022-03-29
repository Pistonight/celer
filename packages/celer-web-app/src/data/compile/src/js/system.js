//A dummy impl of SystemJS
// Predefine order of module loading
var _MODULE_LOAD_ORDER = ["./version", "./type", "./switch", "./RouteScriptBundler"];
var _modules = { };
var _moduleLoadIndex = 0;
var System = {
	register: function(deps, moduleFunction) {
		var moduleName = _MODULE_LOAD_ORDER[_moduleLoadIndex];
		var module = {};
		var moduleDefinition = moduleFunction(function(name, val){ module[name] = val; });
		// Handle imports
		var setters = moduleDefinition.setters;
		for(var i = 0; i<setters.length;i++){
			// Each setter matches deps
			var setter = setters[i];
			setter(_modules[deps[i]]);
		}
		// Load module
		moduleDefinition.execute();
		// Store module
		_modules[moduleName] = module;
		_moduleLoadIndex++;
	}
};

// JS functions not supported by dukpy, so we supply our own implementation
var Number = function(x) {
	return parseFloat(x);
};
Number.isInteger = function(x) {
	return x !== NaN && x !== Infinity && x !== -Infinity && Math.floor(x) === x;
};

var String = function(x) {
	return x + "";
};

var Boolean = function(x){
	return !!x;
};

// Expose bundler
var _getBundler = function() { return _modules["./RouteScriptBundler"]["default"]; };
