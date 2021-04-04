const shell = require("shelljs");

(async () => {
  const project = "power-comp";
  const standaloneProject = `${project}/standalone`;
  const apiProject = `${project}/api`;
  const uiProject = `${project}/ui`;
  const buildPath = `dist/apps/${standaloneProject}`;
  const binPath = `bin/${standaloneProject}`;
  shell.echo("Building Standalone PowerComp");
  shell.mkdir("-p", buildPath);
  shell.rm("-rf", `${buildPath}/*`);
  shell.rm("-rf", `${binPath}/*`);
  shell.mkdir(`${buildPath}/client`);
  shell.echo("Build .exe bundle");
  shell.exec(
    `npx pkg dist/apps/${apiProject}/main.js -t node12-win --output ${buildPath}/powercomp.exe`
  );

  shell.cp(
    `apps/${standaloneProject}/src/env.example`,
    `${buildPath}/power-comp.env`
  );

  shell.cp("-r", `dist/apps/${apiProject}/assets/*`, `${buildPath}`);

  shell.echo("Copy needed files to output folder");
  shell.cp(`apps/${standaloneProject}/src/node_sqlite3.node`, `${buildPath}`);
  shell.cp("-r", `dist/apps/${uiProject}/*`, `${buildPath}/client`);

  shell.mkdir("-p", binPath);  
  shell.cp("-r", `${buildPath}/*`, `bin/${standaloneProject}`);

  shell.echo("Create url");
  shell
    .ShellString(
      `[{000214A0-0000-0000-C000-000000000046}]
Prop3=19,2
[InternetShortcut]
IDList=
URL=http://localhost/
HotKey=0`
    )
    .to(`${binPath}/power-comp.url`);
})().then(() => console.log("Done"));
