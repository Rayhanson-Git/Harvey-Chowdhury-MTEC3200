# Future native evaluation — not started

Reusable: typed scheduling/validation, exercise/routine/session records, snapshot policy, unit/progress/PR calculations, phrase catalog/selection and mascot priorities. SVG source is reusable, though its React/CSS animation wrapper would need a native implementation or a web rendering layer.

Browser-specific: IndexedDB transactions and schema upgrade, BroadcastChannel, visibility/focus listeners, HTML inputs/dialogs, DOM SVG/CSS motion, Web Audio, browser notifications and Blob file downloads. Native would need an equivalent transactional repository, lifecycle handling, accessible controls, file export/import, native notification scheduling/cancellation and permission UX. Native background delivery must be tested on real iOS/Android hardware with suspension, reboot, time/timezone changes and edited deadlines.

Next decision after actual peer testing: evaluate a web wrapper against React Native/Expo and platform-native approaches using the verified core journey. Do not select a framework before clarifying required offline, notification and accessibility behavior. Cross-device synchronization remains a separate product decision with account/privacy/conflict and migration requirements. Keep stable IDs and versioned exports whichever storage is chosen. No native framework, build target or store submission is included in this release.
