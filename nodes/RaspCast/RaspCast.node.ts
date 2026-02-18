import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class RaspCast implements INodeType {
	description: INodeTypeDescription = {
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
					{ name: 'Cache', value: 'cache' },
					{ name: 'Interrupt', value: 'interrupt' },
					{ name: 'Playlist', value: 'playlist' },
					{ name: 'Schedule', value: 'schedule' },
					{ name: 'Stream', value: 'stream' },
				],
				default: 'stream',
			},

			// ------ Cache Operations ------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: { resource: ['cache'] },
				},
				options: [
					{ name: 'Get Status', value: 'getStatus', description: 'Get cache status and file list', action: 'Get cache status' },
					{ name: 'Cleanup', value: 'cleanup', description: 'Check cache integrity and remove orphaned files', action: 'Cleanup cache' },
				],
				default: 'getStatus',
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
					{ name: 'Create', value: 'create', description: 'Create a scheduled program', action: 'Create scheduled program' },
					{ name: 'Delete', value: 'delete', description: 'Delete a scheduled program', action: 'Delete scheduled program' },
					{ name: 'Get All', value: 'getAll', description: 'Get all scheduled programs', action: 'Get all scheduled programs' },
					{ name: 'Update', value: 'update', description: 'Update a scheduled program', action: 'Update scheduled program' },
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
						operation: ['delete', 'update'],
					},
				},
			},

			// --- Interrupt Mode ---
			{
				displayName: 'Mode',
				name: 'interruptMode',
				type: 'options',
				options: [
					{ name: 'Single Track', value: 'single' },
					{ name: 'Multiple Tracks', value: 'multiple' },
				],
				default: 'single',
				description: 'Whether to interrupt with a single track or multiple tracks',
				displayOptions: {
					show: {
						resource: ['interrupt'],
						operation: ['play'],
					},
				},
			},

			// --- Track input (Add Track, Interrupt Single) ---
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
						operation: ['addTrack'],
					},
				},
			},
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
						resource: ['interrupt'],
						operation: ['play'],
						interruptMode: ['single'],
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
						operation: ['addTrack'],
						sourceType: ['file'],
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
						resource: ['interrupt'],
						operation: ['play'],
						interruptMode: ['single'],
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
						operation: ['addTrack'],
						sourceType: ['url'],
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
						resource: ['interrupt'],
						operation: ['play'],
						interruptMode: ['single'],
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
						operation: ['addTrack'],
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
						resource: ['interrupt'],
						operation: ['play'],
						interruptMode: ['single'],
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
						operation: ['addTrack'],
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
						resource: ['interrupt'],
						operation: ['play'],
						interruptMode: ['single'],
					},
				},
			},

			// --- Interrupt Multiple Tracks ---
			{
				displayName: 'Tracks',
				name: 'interruptTracks',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: 'Add Track',
				description: 'Tracks for interrupt playback',
				displayOptions: {
					show: {
						resource: ['interrupt'],
						operation: ['play'],
						interruptMode: ['multiple'],
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
								description: 'Track title (optional)',
							},
							{
								displayName: 'Artist',
								name: 'artist',
								type: 'string',
								default: '',
								description: 'Track artist (optional)',
							},
						],
					},
				],
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
						operation: ['create', 'update'],
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
			{
				displayName: 'Set Shuffle',
				name: 'setShuffle',
				type: 'boolean',
				default: false,
				description: 'Whether to change the shuffle setting',
				displayOptions: {
					show: {
						resource: ['playlist'],
						operation: ['replace'],
					},
				},
			},
			{
				displayName: 'Shuffle',
				name: 'shuffle',
				type: 'boolean',
				default: true,
				description: 'Whether to enable shuffle playback',
				displayOptions: {
					show: {
						resource: ['playlist'],
						operation: ['replace'],
						setShuffle: [true],
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
				description: 'Cron expression for scheduling',
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

			// --- Schedule Update ---
			{
				displayName: 'Program Name',
				name: 'updateProgramName',
				type: 'string',
				default: '',
				placeholder: 'Hourly Jingle',
				description: 'New name for the scheduled program (leave empty to keep current)',
				displayOptions: {
					show: {
						resource: ['schedule'],
						operation: ['update'],
					},
				},
			},
			{
				displayName: 'Cron Expression',
				name: 'updateCron',
				type: 'string',
				default: '',
				placeholder: '0 * * * *',
				description: 'New cron expression (leave empty to keep current)',
				displayOptions: {
					show: {
						resource: ['schedule'],
						operation: ['update'],
					},
				},
			},
			{
				displayName: 'Set Enabled',
				name: 'updateSetEnabled',
				type: 'boolean',
				default: false,
				description: 'Whether to change the enabled state',
				displayOptions: {
					show: {
						resource: ['schedule'],
						operation: ['update'],
					},
				},
			},
			{
				displayName: 'Enabled',
				name: 'updateEnabled',
				type: 'boolean',
				default: true,
				description: 'Whether the scheduled program is enabled',
				displayOptions: {
					show: {
						resource: ['schedule'],
						operation: ['update'],
						updateSetEnabled: [true],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('raspCastApi');
		const serverUrl = (credentials.serverUrl as string).replace(/\/$/, '');
		const apiKey = credentials.apiKey as string;
		const authHeaders = apiKey ? { Authorization: `Bearer ${apiKey}` } : {};

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			let responseData: any;

			// ====== Cache ======
			if (resource === 'cache') {
				if (operation === 'getStatus') {
					responseData = await this.helpers.httpRequest({
						headers: authHeaders,
						method: 'GET',
						url: `${serverUrl}/cache`,
						json: true,
					});
				} else if (operation === 'cleanup') {
					responseData = await this.helpers.httpRequest({
						headers: authHeaders,
						method: 'POST',
						url: `${serverUrl}/cache/cleanup`,
						json: true,
					});
				}
			}

			// ====== Stream ======
			else if (resource === 'stream') {
				if (operation === 'getStatus') {
					responseData = await this.helpers.httpRequest({
						headers: authHeaders,
						method: 'GET',
						url: `${serverUrl}/status`,
						json: true,
					});
				} else if (operation === 'skip') {
					responseData = await this.helpers.httpRequest({
						headers: authHeaders,
						method: 'POST',
						url: `${serverUrl}/skip`,
						json: true,
					});
				} else if (operation === 'skipTo') {
					const trackId = this.getNodeParameter('trackId', i) as string;
					responseData = await this.helpers.httpRequest({
						headers: authHeaders,
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
						headers: authHeaders,
						method: 'GET',
						url: `${serverUrl}/playlist`,
						json: true,
					});
				} else if (operation === 'replace') {
					const tracksJson = this.getNodeParameter('tracksJson', i) as string;
					const tracks = typeof tracksJson === 'string' ? JSON.parse(tracksJson) : tracksJson;
					const body: Record<string, unknown> = { tracks };
					const setShuffle = this.getNodeParameter('setShuffle', i) as boolean;
					if (setShuffle) {
						body.shuffle = this.getNodeParameter('shuffle', i) as boolean;
					}
					responseData = await this.helpers.httpRequest({
						headers: authHeaders,
						method: 'PUT',
						url: `${serverUrl}/playlist`,
						body,
						json: true,
					});
				} else if (operation === 'addTrack') {
					const track = buildTrack(this, i);
					responseData = await this.helpers.httpRequest({
						headers: authHeaders,
						method: 'POST',
						url: `${serverUrl}/playlist/tracks`,
						body: track,
						json: true,
					});
				} else if (operation === 'removeTrack') {
					const trackId = this.getNodeParameter('trackId', i) as string;
					responseData = await this.helpers.httpRequest({
						headers: authHeaders,
						method: 'DELETE',
						url: `${serverUrl}/playlist/tracks/${trackId}`,
						json: true,
					});
				}
			}

			// ====== Interrupt ======
			else if (resource === 'interrupt') {
				if (operation === 'play') {
					const interruptMode = this.getNodeParameter('interruptMode', i) as string;
					let body: Record<string, string> | Record<string, string>[];
					if (interruptMode === 'multiple') {
						const interruptTracks = this.getNodeParameter('interruptTracks', i) as {
							track?: Array<{ sourceType: string; filePath?: string; trackUrl?: string; title?: string; artist?: string }>;
						};
						const trackItems = interruptTracks.track ?? [];
						body = trackItems.map((t) => {
							const track: Record<string, string> = { type: t.sourceType };
							if (t.sourceType === 'file') {
								track.path = t.filePath ?? '';
							} else {
								track.url = t.trackUrl ?? '';
							}
							if (t.title) track.title = t.title;
							if (t.artist) track.artist = t.artist;
							return track;
						});
					} else {
						body = buildTrack(this, i);
					}
					responseData = await this.helpers.httpRequest({
						headers: authHeaders,
						method: 'POST',
						url: `${serverUrl}/interrupt`,
						body,
						json: true,
					});
				}
			}

			// ====== Schedule ======
			else if (resource === 'schedule') {
				if (operation === 'getAll') {
					responseData = await this.helpers.httpRequest({
						headers: authHeaders,
						method: 'GET',
						url: `${serverUrl}/schedule`,
						json: true,
					});
				} else if (operation === 'create') {
					const scheduleTracks = this.getNodeParameter('scheduleTracks', i) as {
						track?: Array<{ sourceType: string; filePath?: string; trackUrl?: string; title?: string; artist?: string }>;
					};
					const trackItems = scheduleTracks.track ?? [];
					const tracks = trackItems.map((t) => {
						const track: Record<string, string> = { type: t.sourceType };
						if (t.sourceType === 'file') {
							track.path = t.filePath ?? '';
						} else {
							track.url = t.trackUrl ?? '';
						}
						if (t.title) track.title = t.title;
						if (t.artist) track.artist = t.artist;
						return track;
					});
					const programName = this.getNodeParameter('programName', i) as string;
					const cron = this.getNodeParameter('cron', i) as string;
					const enabled = this.getNodeParameter('enabled', i) as boolean;
					responseData = await this.helpers.httpRequest({
						headers: authHeaders,
						method: 'POST',
						url: `${serverUrl}/schedule/programs`,
						body: { name: programName, cron, tracks, enabled },
						json: true,
					});
				} else if (operation === 'update') {
					const programId = this.getNodeParameter('programId', i) as string;
					const body: Record<string, unknown> = {};

					const updateName = this.getNodeParameter('updateProgramName', i) as string;
					if (updateName) body.name = updateName;

					const updateCron = this.getNodeParameter('updateCron', i) as string;
					if (updateCron) body.cron = updateCron;

					const updateSetEnabled = this.getNodeParameter('updateSetEnabled', i) as boolean;
					if (updateSetEnabled) {
						body.enabled = this.getNodeParameter('updateEnabled', i) as boolean;
					}

					const scheduleTracks = this.getNodeParameter('scheduleTracks', i) as {
						track?: Array<{ sourceType: string; filePath?: string; trackUrl?: string; title?: string; artist?: string }>;
					};
					const trackItems = scheduleTracks.track ?? [];
					if (trackItems.length > 0) {
						body.tracks = trackItems.map((t) => {
							const track: Record<string, string> = { type: t.sourceType };
							if (t.sourceType === 'file') {
								track.path = t.filePath ?? '';
							} else {
								track.url = t.trackUrl ?? '';
							}
							if (t.title) track.title = t.title;
							if (t.artist) track.artist = t.artist;
							return track;
						});
					}

					responseData = await this.helpers.httpRequest({
						headers: authHeaders,
						method: 'PUT',
						url: `${serverUrl}/schedule/programs/${programId}`,
						body,
						json: true,
					});
				} else if (operation === 'delete') {
					const programId = this.getNodeParameter('programId', i) as string;
					responseData = await this.helpers.httpRequest({
						headers: authHeaders,
						method: 'DELETE',
						url: `${serverUrl}/schedule/programs/${programId}`,
						json: true,
					});
				}
			}

			returnData.push({ json: responseData ?? {} });
		}

		return [returnData];
	}
}

function buildTrack(ef: IExecuteFunctions, index: number): Record<string, string> {
	const sourceType = ef.getNodeParameter('sourceType', index) as string;
	const title = ef.getNodeParameter('title', index) as string;
	const artist = ef.getNodeParameter('artist', index) as string;

	const track: Record<string, string> = { type: sourceType };

	if (sourceType === 'file') {
		track.path = ef.getNodeParameter('filePath', index) as string;
	} else {
		track.url = ef.getNodeParameter('trackUrl', index) as string;
	}

	if (title) track.title = title;
	if (artist) track.artist = artist;

	return track;
}
