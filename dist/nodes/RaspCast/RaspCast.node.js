"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaspCast = void 0;
class RaspCast {
    constructor() {
        this.description = {
            displayName: 'Rasp-Cast',
            name: 'raspCast',
            icon: 'file:rasp-cast.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
            description: 'Control Rasp-Cast internet radio server',
            defaults: {
                name: 'Rasp-Cast',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'raspCastApi',
                    required: true,
                },
            ],
            properties: [
                // ------ Resource ------
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        { name: 'Stream', value: 'stream' },
                        { name: 'Playlist', value: 'playlist' },
                        { name: 'Interrupt', value: 'interrupt' },
                        { name: 'Schedule', value: 'schedule' },
                    ],
                    default: 'stream',
                },
                // ------ Stream Operations ------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: { resource: ['stream'] },
                    },
                    options: [
                        { name: 'Get Status', value: 'getStatus', description: 'Get current streaming status', action: 'Get streaming status' },
                        { name: 'Skip', value: 'skip', description: 'Skip to next track', action: 'Skip to next track' },
                        { name: 'Skip To', value: 'skipTo', description: 'Jump to a specific track by ID', action: 'Skip to specific track' },
                    ],
                    default: 'getStatus',
                },
                // ------ Playlist Operations ------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: { resource: ['playlist'] },
                    },
                    options: [
                        { name: 'Get All', value: 'getAll', description: 'Get current playlist', action: 'Get playlist' },
                        { name: 'Replace', value: 'replace', description: 'Replace entire playlist', action: 'Replace playlist' },
                        { name: 'Add Track', value: 'addTrack', description: 'Add a track to the playlist', action: 'Add track to playlist' },
                        { name: 'Remove Track', value: 'removeTrack', description: 'Remove a track from the playlist', action: 'Remove track from playlist' },
                    ],
                    default: 'getAll',
                },
                // ------ Interrupt Operations ------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: { resource: ['interrupt'] },
                    },
                    options: [
                        { name: 'Play', value: 'play', description: 'Interrupt current playback with a track', action: 'Play interrupt track' },
                    ],
                    default: 'play',
                },
                // ------ Schedule Operations ------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: { resource: ['schedule'] },
                    },
                    options: [
                        { name: 'Get All', value: 'getAll', description: 'Get all scheduled programs', action: 'Get all scheduled programs' },
                        { name: 'Create', value: 'create', description: 'Create a scheduled program', action: 'Create scheduled program' },
                        { name: 'Delete', value: 'delete', description: 'Delete a scheduled program', action: 'Delete scheduled program' },
                    ],
                    default: 'getAll',
                },
                // ====== Parameters ======
                // --- Track ID (Skip To, Remove Track, Schedule Delete) ---
                {
                    displayName: 'Track ID',
                    name: 'trackId',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The UUID of the track',
                    displayOptions: {
                        show: {
                            resource: ['stream'],
                            operation: ['skipTo'],
                        },
                    },
                },
                {
                    displayName: 'Track ID',
                    name: 'trackId',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The UUID of the track to remove',
                    displayOptions: {
                        show: {
                            resource: ['playlist'],
                            operation: ['removeTrack'],
                        },
                    },
                },
                {
                    displayName: 'Program ID',
                    name: 'programId',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The UUID of the scheduled program',
                    displayOptions: {
                        show: {
                            resource: ['schedule'],
                            operation: ['delete'],
                        },
                    },
                },
                // --- Track input (Add Track, Interrupt Play) ---
                {
                    displayName: 'Source Type',
                    name: 'sourceType',
                    type: 'options',
                    options: [
                        { name: 'File', value: 'file' },
                        { name: 'URL', value: 'url' },
                    ],
                    default: 'file',
                    description: 'Whether the track is a local file or remote URL',
                    displayOptions: {
                        show: {
                            operation: ['addTrack', 'play'],
                        },
                    },
                },
                {
                    displayName: 'File Path',
                    name: 'filePath',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: 'music/jingle.mp3',
                    description: 'Relative path to the MP3 file on the server',
                    displayOptions: {
                        show: {
                            operation: ['addTrack', 'play'],
                            sourceType: ['file'],
                        },
                    },
                },
                {
                    displayName: 'URL',
                    name: 'trackUrl',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: 'https://example.com/track.mp3',
                    description: 'URL of the remote MP3 file',
                    displayOptions: {
                        show: {
                            operation: ['addTrack', 'play'],
                            sourceType: ['url'],
                        },
                    },
                },
                {
                    displayName: 'Title',
                    name: 'title',
                    type: 'string',
                    default: '',
                    description: 'Track title (auto-detected from ID3 tags if omitted for file type)',
                    displayOptions: {
                        show: {
                            operation: ['addTrack', 'play'],
                        },
                    },
                },
                {
                    displayName: 'Artist',
                    name: 'artist',
                    type: 'string',
                    default: '',
                    description: 'Track artist (auto-detected from ID3 tags if omitted for file type)',
                    displayOptions: {
                        show: {
                            operation: ['addTrack', 'play'],
                        },
                    },
                },
                // --- Schedule Tracks (multiple) ---
                {
                    displayName: 'Tracks',
                    name: 'scheduleTracks',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    default: {},
                    placeholder: 'Add Track',
                    description: 'Tracks to include in the scheduled program',
                    displayOptions: {
                        show: {
                            resource: ['schedule'],
                            operation: ['create'],
                        },
                    },
                    options: [
                        {
                            displayName: 'Track',
                            name: 'track',
                            values: [
                                {
                                    displayName: 'Source Type',
                                    name: 'sourceType',
                                    type: 'options',
                                    options: [
                                        { name: 'File', value: 'file' },
                                        { name: 'URL', value: 'url' },
                                    ],
                                    default: 'file',
                                    description: 'Whether the track is a local file or remote URL',
                                },
                                {
                                    displayName: 'File Path',
                                    name: 'filePath',
                                    type: 'string',
                                    default: '',
                                    placeholder: 'music/jingle.mp3',
                                    description: 'Relative path to the MP3 file on the server (for file type)',
                                },
                                {
                                    displayName: 'URL',
                                    name: 'trackUrl',
                                    type: 'string',
                                    default: '',
                                    placeholder: 'https://example.com/track.mp3',
                                    description: 'URL of the remote MP3 file (for URL type)',
                                },
                                {
                                    displayName: 'Title',
                                    name: 'title',
                                    type: 'string',
                                    default: '',
                                    description: 'Track title (optional, auto-detected from ID3 tags for files)',
                                },
                                {
                                    displayName: 'Artist',
                                    name: 'artist',
                                    type: 'string',
                                    default: '',
                                    description: 'Track artist (optional, auto-detected from ID3 tags for files)',
                                },
                            ],
                        },
                    ],
                },
                // --- Playlist Replace ---
                {
                    displayName: 'Tracks (JSON)',
                    name: 'tracksJson',
                    type: 'json',
                    default: '[\n  { "type": "file", "path": "music/song.mp3" }\n]',
                    required: true,
                    description: 'Array of tracks in JSON format',
                    displayOptions: {
                        show: {
                            resource: ['playlist'],
                            operation: ['replace'],
                        },
                    },
                },
                // --- Schedule Create ---
                {
                    displayName: 'Program Name',
                    name: 'programName',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: 'Hourly Jingle',
                    description: 'Name of the scheduled program',
                    displayOptions: {
                        show: {
                            resource: ['schedule'],
                            operation: ['create'],
                        },
                    },
                },
                {
                    displayName: 'Cron Expression',
                    name: 'cron',
                    type: 'string',
                    default: '0 * * * *',
                    required: true,
                    placeholder: '0 * * * *',
                    description: 'Cron expression for scheduling (timezone: Asia/Tokyo)',
                    displayOptions: {
                        show: {
                            resource: ['schedule'],
                            operation: ['create'],
                        },
                    },
                },
                {
                    displayName: 'Enabled',
                    name: 'enabled',
                    type: 'boolean',
                    default: true,
                    description: 'Whether the scheduled program is enabled',
                    displayOptions: {
                        show: {
                            resource: ['schedule'],
                            operation: ['create'],
                        },
                    },
                },
            ],
        };
    }
    async execute() {
        var _a;
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials('raspCastApi');
        const serverUrl = credentials.serverUrl.replace(/\/$/, '');
        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter('resource', i);
            const operation = this.getNodeParameter('operation', i);
            let responseData;
            // ====== Stream ======
            if (resource === 'stream') {
                if (operation === 'getStatus') {
                    responseData = await this.helpers.httpRequest({
                        method: 'GET',
                        url: `${serverUrl}/status`,
                        json: true,
                    });
                }
                else if (operation === 'skip') {
                    responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'raspCastApi', {
                        method: 'POST',
                        url: `${serverUrl}/skip`,
                        json: true,
                    });
                }
                else if (operation === 'skipTo') {
                    const trackId = this.getNodeParameter('trackId', i);
                    responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'raspCastApi', {
                        method: 'POST',
                        url: `${serverUrl}/skip/${trackId}`,
                        json: true,
                    });
                }
            }
            // ====== Playlist ======
            else if (resource === 'playlist') {
                if (operation === 'getAll') {
                    responseData = await this.helpers.httpRequest({
                        method: 'GET',
                        url: `${serverUrl}/playlist`,
                        json: true,
                    });
                }
                else if (operation === 'replace') {
                    const tracksJson = this.getNodeParameter('tracksJson', i);
                    const tracks = typeof tracksJson === 'string' ? JSON.parse(tracksJson) : tracksJson;
                    responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'raspCastApi', {
                        method: 'PUT',
                        url: `${serverUrl}/playlist`,
                        body: { tracks },
                        json: true,
                    });
                }
                else if (operation === 'addTrack') {
                    const track = buildTrack(this, i);
                    responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'raspCastApi', {
                        method: 'POST',
                        url: `${serverUrl}/playlist/tracks`,
                        body: track,
                        json: true,
                    });
                }
                else if (operation === 'removeTrack') {
                    const trackId = this.getNodeParameter('trackId', i);
                    responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'raspCastApi', {
                        method: 'DELETE',
                        url: `${serverUrl}/playlist/tracks/${trackId}`,
                        json: true,
                    });
                }
            }
            // ====== Interrupt ======
            else if (resource === 'interrupt') {
                if (operation === 'play') {
                    const track = buildTrack(this, i);
                    responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'raspCastApi', {
                        method: 'POST',
                        url: `${serverUrl}/interrupt`,
                        body: track,
                        json: true,
                    });
                }
            }
            // ====== Schedule ======
            else if (resource === 'schedule') {
                if (operation === 'getAll') {
                    responseData = await this.helpers.httpRequest({
                        method: 'GET',
                        url: `${serverUrl}/schedule`,
                        json: true,
                    });
                }
                else if (operation === 'create') {
                    const scheduleTracks = this.getNodeParameter('scheduleTracks', i);
                    const trackItems = (_a = scheduleTracks.track) !== null && _a !== void 0 ? _a : [];
                    const tracks = trackItems.map((t) => {
                        var _a, _b;
                        const track = { type: t.sourceType };
                        if (t.sourceType === 'file') {
                            track.path = (_a = t.filePath) !== null && _a !== void 0 ? _a : '';
                        }
                        else {
                            track.url = (_b = t.trackUrl) !== null && _b !== void 0 ? _b : '';
                        }
                        if (t.title)
                            track.title = t.title;
                        if (t.artist)
                            track.artist = t.artist;
                        return track;
                    });
                    const programName = this.getNodeParameter('programName', i);
                    const cron = this.getNodeParameter('cron', i);
                    const enabled = this.getNodeParameter('enabled', i);
                    responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'raspCastApi', {
                        method: 'POST',
                        url: `${serverUrl}/schedule/programs`,
                        body: { name: programName, cron, tracks, enabled },
                        json: true,
                    });
                }
                else if (operation === 'delete') {
                    const programId = this.getNodeParameter('programId', i);
                    responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'raspCastApi', {
                        method: 'DELETE',
                        url: `${serverUrl}/schedule/programs/${programId}`,
                        json: true,
                    });
                }
            }
            returnData.push({ json: responseData !== null && responseData !== void 0 ? responseData : {} });
        }
        return [returnData];
    }
}
exports.RaspCast = RaspCast;
function buildTrack(ef, index) {
    const sourceType = ef.getNodeParameter('sourceType', index);
    const title = ef.getNodeParameter('title', index);
    const artist = ef.getNodeParameter('artist', index);
    const track = { type: sourceType };
    if (sourceType === 'file') {
        track.path = ef.getNodeParameter('filePath', index);
    }
    else {
        track.url = ef.getNodeParameter('trackUrl', index);
    }
    if (title)
        track.title = title;
    if (artist)
        track.artist = artist;
    return track;
}
//# sourceMappingURL=RaspCast.node.js.map