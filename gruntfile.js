module.exports = function (grunt) {
	
	var path = require('path')
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        pkg: pkg,
		dest: grunt.option('target') || 'dist',
		basePath: path.join('<%= dest %>', 'App_Plugins', '<%= pkgMeta.name %>'),
		pkgMeta: grunt.file.readJSON('config/meta.json'),
		clean: {
            files: [
                'files/**/*.*'
            ],
			build: '<%= grunt.config("basePath").substring(0, 4) == "dist" ? "dist/**/*" : "null" %>',
      		tmp: ['tmp']
        },
        copy: {
			app_plugins: {
				cwd: 'src/App_Plugins/UmbracoBookshelf',
				src: ['**'],
				dest: '<%= basePath %>',
				expand: true
			},
			dll: {
				cwd: 'src/bin/',
				src: pkg.name + '.dll',
				dest: '<%= dest %>/bin/',
				expand: true
			},
			umbraco: {
				cwd: '<%= dest %>',
				src: '**/*',
				dest: 'tmp/umbraco',
				expand: true
			}
        },
		umbracoPackage: {
			dist: {
				src: 'tmp/umbraco',
				dest: 'pkg',
				options: {
					name: "<%= pkgMeta.name %>",
					version: '<%= pkgMeta.version %>',
					url: '<%= pkgMeta.url %>',
					license: '<%= pkgMeta.license %>',
					licenseUrl: '<%= pkgMeta.licenseUrl %>',
					author: '<%= pkgMeta.author %>',
					authorUrl: '<%= pkgMeta.authorUrl %>',
					manifest: 'config/package.xml',
					readme: 'config/readme.txt'
				}
			}
		},
		assemblyinfo: {
			options: {
				files: ['src/UmbracoBookshelf.csproj'],
				filename: 'AssemblyInfo.cs',
				info: {
					version: '<%= (pkgMeta.version.indexOf("-") ? pkgMeta.version.substring(0, pkgMeta.version.indexOf("-")) : pkgMeta.version) %>', 
					fileVersion: '<%= pkgMeta.version %>'
				}
			}
		},

		msbuild: {
			options: {
				stdout: true,
				verbosity: 'quiet',
				maxCpuCount: 4,
				version: 4.0,
				buildParameters: {
					WarningLevel: 2,
					NoWarn: 1607
				}
			},
			dist: {
				src: ['src/UmbracoBookshelf.csproj'],
				options: {
					projectConfiguration: 'Debug',
					targets: ['Clean', 'Rebuild'],
				}
			}
		}
    });
    
	
	grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-umbraco-package');
    grunt.loadNpmTasks('grunt-dotnet-assembly-info');
    grunt.loadNpmTasks('grunt-msbuild');

	grunt.registerTask('default', ['clean', 'assemblyinfo', 'msbuild:dist', 'copy:dll', 'copy:app_plugins', ]);
    grunt.registerTask('umbraco', ['clean:tmp', 'default', 'copy:umbraco', 'umbracoPackage']);
    

};