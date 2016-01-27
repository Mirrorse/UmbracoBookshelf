module.exports = function(grunt) {

    // Load the package JSON file
    var pkg = grunt.file.readJSON('package.json');

    // get the root path of the project
    var projectRoot = 'src/';

    // Load information about the assembly
    var assembly = grunt.file.readJSON(projectRoot + 'Properties/AssemblyInfo.json');

    // Get the version of the package
    var version = assembly.informationalVersion ? assembly.informationalVersion : assembly.version;

    grunt.initConfig({
        pkg: pkg,
        copy: {
            release: {
                files: [
                    {
                        expand: true,
                        cwd: projectRoot + 'bin/Release/',
                        src: [
                            pkg.name + '.dll',
                            pkg.name + '.xml'
                        ],
                        dest: 'files/bin/'
                    }
                ]
            }
        },
        umbracoPackage: {
                src: 'files/',
                dest: 'releases/umbraco',
                options: {
                    name: pkg.name,
                    version: version,
                    url: pkg.url,
                    license: pkg.license.name,
                    licenseUrl: pkg.license.url,
                    author: pkg.author.name,
                    authorUrl: pkg.author.url,
                    readme: pkg.readme,
                    manifest: 'config/package.xml',
                    outputName: pkg.name + '.v' + version + '.zip',
                    sourceDir: 'tmp/umbraco',
                    outputDir: 'pkg'
                }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-umbraco-package');

    grunt.registerTask('dev', ['copy', 'umbracoPackage']);
    grunt.registerTask('default', ['dev']);

};