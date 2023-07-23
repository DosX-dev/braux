// Github: https://github.com/DosX-dev/braux

function fingerprint() {
    var fingerprintData = {
        'User Agent': navigator.userAgent,
        'Browser Language': navigator.language,
        'Cookies Enabled': navigator.cookieEnabled,
        'Screen Resolution': screen.width + 'x' + screen.height,
        'Available Screen Resolution': screen.availWidth + 'x' + screen.availHeight,
        'Color Depth': screen.colorDepth,
        'Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        'Local Storage Enabled': typeof Storage !== 'undefined',
        'Session Storage Enabled': typeof sessionStorage !== 'undefined',
        'Do Not Track': Boolean(navigator.doNotTrack),
        'Plugins': Array.from(navigator.plugins).map(plugin => plugin.name).join(', '),
        'WebGL Vendor': getWebGLVendor(),
        'WebGL Renderer': getWebGLRenderer(),
        'WebGL Version': getWebGLVersion(),
        'Web Audio API': isWebAudioAPISupported(),
        'MIDI API': isMIDIAPIAvailable(),
        'WebSockets Supported': isWebSocketsSupported(),
        'Battery API Supported': isBatteryAPISupported(),
        'WebVR API Supported': isWebVRAPIAvailable(),
        'AudioContext Max Channels': getMaxAudioContextChannels(),
        'Is Chromium based': isChromium()
    };

    var fingerprintString = Object.entries(fingerprintData)
        .map(entry => `<b>${entry[0]}</b>` + ': ' + entry[1])
        .join('\n');

    return fingerprintString;
}

function getWebGLVendor() {
    var canvas = document.createElement('canvas'),
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl && gl.getExtension('WEBGL_debug_renderer_info')) { return gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_VENDOR_WEBGL); }
    return 'N/A';
}

function getWebGLRenderer() {
    var canvas = document.createElement('canvas'),
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl && gl.getExtension('WEBGL_debug_renderer_info')) { return gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL); }
    return 'N/A';
}

function getWebGLVersion() {
    var canvas = document.createElement('canvas'),
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) { return gl.getParameter(gl.VERSION); }
    return 'N/A';
}

function isWebAudioAPISupported() { return typeof window.AudioContext !== 'undefined' || typeof window.webkitAudioContext !== 'undefined'; }

function isMIDIAPIAvailable() { return typeof navigator.requestMIDIAccess !== 'undefined'; }

function isWebSocketsSupported() { return 'WebSocket' in window ? 'Supported' : 'Not supported'; }

function isBatteryAPISupported() { return navigator.getBattery ? 'Supported' : 'Not supported'; }

function isWebVRAPIAvailable() { return 'getVRDisplays' in navigator ? 'Supported' : 'Not supported'; }

function isWebXRAPIAvailable() { return 'xr' in navigator ? 'Supported' : 'Not supported'; }

function getMaxAudioContextChannels() {
    try {
        var audioContext = new(window.AudioContext || window.webkitAudioContext)(),
            maxChannels = audioContext.destination.maxChannelCount;
        audioContext.close();
        return maxChannels;
    } catch (exc) {
        return 'N/A'
    }
}

function isChromium() { return typeof window.chrome == 'object'; }

function isOpera() { return typeof window.opera == 'object'; }