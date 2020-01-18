//import { OrbitControls } from './jsm/controls/OrbitControls.js';
var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 1024;
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var FLOOR = - 250;
var ANIMATION_GROUPS = 25;
var camera, controls, scene, renderer;
var container;
var NEAR = 1, FAR = 300000;
var morph, morphs = [], mixer, animGroups = [];
var light;
var clock = new THREE.Clock();
var blobs = [];
var mouseX = 0;
var mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var path = "./tex4/";
var format = '.png';
var urls = [
	path + 'posx' + format, path + 'negx' + format,
	path + 'posy' + format, path + 'negy' + format,
	path + 'posz' + format, path + 'negz' + format
	
];


var reflectionCube = new THREE.CubeTextureLoader().load( urls );
reflectionCube.format = THREE.RGBFormat;
var refractionCube = new THREE.CubeTextureLoader().load( urls );
refractionCube.mapping = THREE.CubeRefractionMapping;
refractionCube.format = THREE.RGBForm;

var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.01, 10000 );
camera.position.z = 10;
camera.focalLength = 10;

//load the controller
		
init();
animate();
function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// SCENE
	scene = new THREE.Scene();
	//scene.background = new THREE.Color( 0x59472b );
	scene.background = reflectionCube;
	scene.fog = new THREE.FogExp2( 0xf7ffe6, 0.0025 );

	// LIGHTS
	var ambient = new THREE.AmbientLight( 0x444444 );
	scene.add( ambient );
	light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2 );
	light.position.set( 0, 1500, 1000 );
	light.target.position.set( 0, 0, 0 );
	light.castShadow = true;
	light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 700, FAR ) );
	light.shadow.bias = 0.0001;
	light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
	light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
	scene.add( light );
	createScene();

	// RENDERER
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	container.appendChild( renderer.domElement );
	renderer.autoClear = false;
	//
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	// controls
	var controls = new THREE.OrbitControls( camera,renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );
}

function createScene( ) {

	var amount;
	var wheelAmount;
	if(window.matchMedia("(min-width:500px)")) {
		amount = 250;
		wheelAmount = 150;
	} else {
		amount = 75;
		wheelAmount = 25;
	}

	mixer = new THREE.AnimationMixer( scene );
	for ( var i = 0; i !== ANIMATION_GROUPS; ++ i ) {
		var group = new THREE.AnimationObjectGroup();
		animGroups.push( group );
	}
	// MORPHS
	function addMorph( mesh, clip, speed, duration, x, y, z, fudgeColor,massOptimization ) {
		mesh = mesh.clone();
		mesh.material = mesh.material.clone();
		if ( fudgeColor ) {
			mesh.material.color.offsetHSL( 0, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25 );
		}
		mesh.speed = speed;

		if ( massOptimization ) {
			var index = Math.floor( Math.random() * ANIMATION_GROUPS ),
				animGroup = animGroups[ index ];
			animGroup.add( mesh );
			if ( ! mixer.existingAction( clip, animGroup ) ) {
				var randomness = 0.6 * Math.random() - 0.3;
				var phase = ( index + randomness ) / ANIMATION_GROUPS;
				mixer.clipAction( clip, animGroup ).
					setDuration( duration ).
					startAt( - duration * phase ).
					play();
			}
		} else {
			mixer.clipAction( clip, mesh ).
				setDuration( duration ).
				startAt( - duration * Math.random() ).
				play();
		}
		mesh.position.x = Math.random() * 800 - 400;
		mesh.position.y = Math.random() * 800 - 400;
		mesh.position.z = Math.random() * 800 - 400;
		mesh.rotation.x = Math.random() * 2 * Math.PI;
		mesh.rotation.y = Math.random() * 2 * Math.PI;
		mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * .1;
		scene.add( mesh );
		morphs.push( mesh );
		blobs.push( mesh );
	}
				
	var loader = new THREE.GLTFLoader();
	var cubeMaterial3 = new THREE.MeshPhongMaterial( { color: 0xccddff,refractionRatio: 0.98, reflectivity: 0.9 } );
	loader.load( "3d/clearblob20.gltf", function ( gltf ) {
		var mesh = gltf.scene.children[ 0 ];
		gltf.scene.traverse(function (child){
			sceneMesh = child;
		 } ); 
		var clip = gltf.animations[ 0 ];
		var mesh = new THREE.Mesh( mesh.geometry, mesh.material );
		for ( var i = 0; i < amount - (amount*.4); i ++ ) {
			addMorph( mesh, clip, 1, 1, 100 - Math.random() * 3000, FLOOR, i, true, true );	
		}
	});
			   
		var loader = new THREE.GLTFLoader();
		var cubeMaterial1 = new THREE.MeshLambertMaterial( { color: 0x94b8b8, refractionRatio: 0.98, reflectivity: 0.9 } );
		loader.load( '3d/cigar5.gltf', function ( gltf ) { 
			var sceneMesh;
			//gltf.scene.scale.set(.1,.09,.09);  
			gltf.scene.traverse(function (child) {
			   sceneMesh = child;
		} );
		 
			for ( var i = 0; i < wheelAmount; i ++ ) {
			var mesh = new THREE.Mesh( sceneMesh.geometry, cubeMaterial1 );

			mesh.position.x = Math.random() * 8000 - 400;
			mesh.position.y = Math.random() * 800 - 400;
			mesh.position.z = Math.random() * 800 - 400;
			mesh.rotation.x = Math.random() * 2 * Math.PI;
			mesh.rotation.y = Math.random() * 2 * Math.PI;
			mesh.scale.x = mesh.scale.z = mesh.scale.y = Math.random() * .1;
			scene.add( mesh );
			blobs.push( mesh );
			
			}
		}, undefined, function ( error ) {
				
			console.error( error );
	} );
}
			//
	var amount;
	var wheelAmount;
	if(window.matchMedia("(min-width:500px)")) {
		amount = 250;
		wheelAmount = 150;
	} else {
		amount = 75;
		wheelAmount = 25;
	}

	var loader = new THREE.GLTFLoader();
	var cubeMaterial1 = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: reflectionCube } );
	loader.load( '3d/triangle.gltf', function ( gltf ) { 
		var sceneMesh;
		//gltf.scene.scale.set(.1,.1,.1);  
		gltf.scene.traverse(function (child){
		   sceneMesh = child;
		} );
	
		for ( var i = 0; i < amount; i ++ ) {
		var mesh = new THREE.Mesh( sceneMesh.geometry, cubeMaterial1 );
		
		mesh.position.x = Math.random() * 8000 - 400;
		mesh.position.y = Math.random() * 800 - 400;
		mesh.position.z = Math.random() * 800 - 400;
		mesh.rotation.x = Math.random() * 2 * Math.PI;
		mesh.rotation.y = Math.random() * 2 * Math.PI;
		mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * .1;
		scene.add( mesh );
		blobs.push( mesh );
		
	 }
	}, undefined, function ( error ) {
			
		console.error( error );				
}); 
document.addEventListener( 'mousemove', onDocumentMouseMove, false );

function animate() {
   render();
   requestAnimationFrame( animate );
}

function render() {
	var timer = 0.0001 * Date.now();
	var delta = clock.getDelta();
	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;
	camera.lookAt( scene.position );
	if ( mixer ) mixer.update( delta );
	for ( var i = 0; i < morphs.length; i ++ ) {
		morph = morphs[ i ];
		for ( var i = 0, il = blobs.length; i < il; i ++ ) {
			blobs[ i ].position.x = 300 * Math.cos( timer + i );
			blobs[ i ].position.y = 300 * Math.sin( timer + i * 1.1 );
		}
		
	}
	renderer.clear();
	renderer.render( scene, camera );
}
	function onWindowResize() {
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		effect.setSize( window.innerWidth, window.innerHeight );
	 }
	 function onDocumentMouseMove( event ) {
		mouseX = ( event.clientX - windowHalfX ) / 10;
		mouseY = ( event.clientY - windowHalfY ) / 10;
	 }
				 


