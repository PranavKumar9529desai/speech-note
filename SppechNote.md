
Options:
  --app-standalone                 Runs in standalone mode (default). App and
                                   service are not splitted.
  --app                            Starts app is splitted mode. App will need
                                   service to function properly.
  --service                        Starts service only.
  --verbose                        Enables debug output.
  --print-state <scope>            Prints the current state in the application
                                   for the specified <scope>. Supported scopes
                                   are: general, task.
  --print-available-models <role>  Prints a list of available models for the
                                   specified <role>. Supported roles are: tts,
                                   stt.
  --print-active-model <role>      Prints the currently active model for the
                                   specified <role>. Supported roles are: tts,
                                   stt.
  --action <action>                Invokes an <action>. Supported actions are:7
                                   start-listening, start-listening-translate,
                                   start-listening-active-window,
                                   start-listening-translate-active-window,
                                   start-listening-clipboard,
                                   start-listening-translate-clipboard,
                                   stop-listening, start-reading,
                                   start-reading-clipboard, start-reading-text,
                                   pause-resume-reading, cancel,
                                   switch-to-next-stt-model,
                                   switch-to-prev-stt-model,
                                   switch-to-next-tts-model,
                                   switch-to-prev-tts-model, set-stt-model,
                                   set-tts-model.
  --id <id>                        Language or model id. Used together with
                                   start-listening-clipboard,
                                   start-reading-text, set-stt-model or
                                   set-tts-model action.
  --text <text>                    Text to read. Used together with
                                   start-reading-text.
  --gen-checksums                  Generates checksums for models without
                                   checksum. Useful when adding new models to
                                   config file manually.
  --hw-scan-off                    Disables scanning for CUDA, ROCm, Vulkan,
                                   OpenVINO and OpenCL compatible hardware. Use
                                   this option when you observing problems in
                                   starting the app.
  --py-scan-off                    Disables scanning for Python libraries. Use
                                   this option when you observing problems in
                                   starting the app.
  --reset-models                   Reset the models configuration file to
                                   default settings.
  --start-in-tray                  Starts minimized to the system tray.
  --log-file <log-file>            Write logs to <log-file> instead of stderr.
  -h, --help                       Displays help on commandline options.
  --help-all                       Displays help including Qt specific options.
  -v, --version                    Displays version information.

Arguments:
  files                            Text, Audio or Video files to open,
                                   optionally.
