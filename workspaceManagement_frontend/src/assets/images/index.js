// Local Assets Registry matching WMS Syllabus & Figma Specifications

export const IMAGES = {
  dpAdminUsman: require('./dp_admin_usman.png'),
  dpHrSana: require('./dp_hr_sana.png'),
  dpMgrBilal: require('./dp_mgr_bilal.png'),
  dpEmpAli: require('./dp_emp_ali.png'),
  dpEmpHamza: require('./dp_emp_hamza.png'),
  dpClientZafar: require('./dp_client_zafar.png'),
  appLogo: require('./app_logo.png'),
  mapLahoreCampus: require('./map_lahore_campus.png'),
  telemetryCampusHub: require('./telemetry_campus_hub.jpg'),
  evidenceSignoutSheet: require('./evidence_signout_sheet.jpg'),
};

// 4 DP Presets for Add/Edit Employee screen & role avatars
export const AVATAR_DP_PRESETS = [
  {
    id: 'preset_engineering',
    name: 'Engineering',
    role: 'EMPLOYEE',
    image: IMAGES.dpEmpAli,
    label: 'Engineering (Ali Raza)',
    accent: '#4338CA',
  },
  {
    id: 'preset_hr',
    name: 'HR',
    role: 'HR',
    image: IMAGES.dpHrSana,
    label: 'HR Specialist (Sana Khan)',
    accent: '#0F766E',
  },
  {
    id: 'preset_manager',
    name: 'Manager',
    role: 'MANAGER',
    image: IMAGES.dpMgrBilal,
    label: 'Manager (Bilal Ahmed)',
    accent: '#1D4ED8',
  },
  {
    id: 'preset_executive',
    name: 'Executive',
    role: 'ADMIN',
    image: IMAGES.dpAdminUsman,
    label: 'Executive (Usman Tariq)',
    accent: '#1E293B',
  },
];

export const getAvatarSource = (avatarKeyOrUri) => {
  if (!avatarKeyOrUri) return IMAGES.dpEmpAli;
  if (typeof avatarKeyOrUri === 'number' || (typeof avatarKeyOrUri === 'object' && avatarKeyOrUri.uri)) {
    return avatarKeyOrUri;
  }
  if (typeof avatarKeyOrUri === 'string') {
    if (avatarKeyOrUri.startsWith('http://') || avatarKeyOrUri.startsWith('https://') || avatarKeyOrUri.startsWith('data:') || avatarKeyOrUri.startsWith('file://')) {
      return { uri: avatarKeyOrUri };
    }
    // Check known keys
    if (IMAGES[avatarKeyOrUri]) {
      return IMAGES[avatarKeyOrUri];
    }
  }
  return IMAGES.dpEmpAli;
};

export default IMAGES;
