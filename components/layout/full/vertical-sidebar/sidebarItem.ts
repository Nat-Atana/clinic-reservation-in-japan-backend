import {
    ApertureIcon,
    CopyIcon,
    LayoutDashboardIcon, LoginIcon, MoodHappyIcon, TypographyIcon, UserPlusIcon, BuildingHospitalIcon, WomanIcon,CalendarEventIcon,
    FrameIcon,DatabaseIcon,BellIcon,UsersIcon,SettingsIcon,LogoutIcon,BuildingIcon
} from 'vue-tabler-icons';

export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
}

const sidebarItem: menu[] = [
    // {
    //     title: 'ダッシュボード',
    //     icon: LayoutDashboardIcon,
    //     to: '/'
    // },
    {
        title: '設定',
        icon: SettingsIcon,
        to: '/setting'
    },
    {
        title: 'ユーザー管理',
        icon: UsersIcon,
        header: 'users',
        to: '/users'
    },
    {
        title: '休⽇管理',
        icon: CalendarEventIcon,
        header: 'holiday',
        to: '/breakdays'
    },
    {
        title: '診療科管理',
        icon: BuildingHospitalIcon,
        header: 'clinic',
        to: '/clinic'
    },
    {
        title: '担当医管理',
        icon: WomanIcon,
        header: 'doctor',
        to: '/doctor'
    },
    {
        title: '診察室管理',
        icon: BuildingIcon,
        header: 'room',
        to: '/rooms'
    },
    {
        title: '予約枠管理',
        icon: FrameIcon,
        header: 'frame',
        to: '/frames'
    },
    {
        title: '予約データ管理',
        icon: DatabaseIcon,
        header: 'reservation',
        to: '/reserves'
    },
    {
        title: 'Atana',
        icon: BellIcon,
        header: 'atana',
        to: '/atanas'
    },
    {
        title: 'ログアウト',
        icon: LogoutIcon,
        header: 'logout',
        to: '/auth/login'
    },

    /*{ header: 'auth' },
    {
        title: 'Login',
        icon: LoginIcon,
        to: '/auth/login'
    },
    {
        title: 'Register',
        icon: UserPlusIcon,
        to: '/auth/register'
    },
    { header: 'Extra' },
    {
        title: 'Icons',
        icon: MoodHappyIcon,
        to: '/icons'
    },
    {
        title: 'Sample Page',
        icon: ApertureIcon,
        to: '/sample-page'
    },*/
];

export default sidebarItem;
