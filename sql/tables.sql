create table
  public.bosses (
    id uuid not null default extensions.uuid_generate_v4 (),
    name character varying(255) not null,
    image_url text null,
    description text null,
    element character varying(50) null,
    weak_element character varying(50) null,
    mode_id uuid null,
    mode_type character varying(50) null,
    slug character varying(255) null,
    constraint bosses_pkey primary key (id),
    constraint bosses_mode_id_fkey foreign key (mode_id) references modes (id) on delete cascade
  ) tablespace pg_default;

  create table
  public.chapter_teams (
    id uuid not null default extensions.uuid_generate_v4 (),
    chapter_id uuid null,
    team_id uuid null,
    constraint chapter_teams_pkey primary key (id),
    constraint chapter_teams_chapter_id_team_id_key unique (chapter_id, team_id),
    constraint chapter_teams_chapter_id_fkey foreign key (chapter_id) references chapters (id) on delete cascade,
    constraint chapter_teams_team_id_fkey foreign key (team_id) references teams (id) on delete cascade
  ) tablespace pg_default;

  create table
  public.chapters (
    id uuid not null default extensions.uuid_generate_v4 (),
    chapter_number integer not null,
    difficulty character varying(50) not null,
    mode_id uuid null,
    title character varying(255) not null,
    image_path text not null,
    constraint chapters_pkey primary key (id),
    constraint chapters_chapter_number_difficulty_key unique (chapter_number, difficulty),
    constraint chapters_mode_id_fkey foreign key (mode_id) references modes (id) on delete cascade
  ) tablespace pg_default;

  create table
  public.game_versions (
    id uuid not null default extensions.uuid_generate_v4 (),
    version character varying(50) not null,
    release_date timestamp without time zone null default current_timestamp,
    constraint game_versions_pkey primary key (id),
    constraint game_versions_version_key unique (version)
  ) tablespace pg_default;

create table
  public.interception_team_nikkes (
    id uuid not null default extensions.uuid_generate_v4 (),
    team_id uuid null,
    nikke_id uuid null,
    position integer not null,
    constraint interception_team_nikkes_pkey primary key (id),
    constraint interception_team_nikkes_nikke_id_fkey foreign key (nikke_id) references nikkes (id) on delete cascade,
    constraint interception_team_nikkes_team_id_fkey foreign key (team_id) references interception_teams (id) on delete cascade,
    constraint interception_team_nikkes_position_check check (
      (
        ("position" >= 1)
        and ("position" <= 5)
      )
    )
  ) tablespace pg_default;

  create table
  public.interception_teams (
    id uuid not null default extensions.uuid_generate_v4 (),
    user_id uuid null,
    mode_id uuid null,
    boss_id uuid null,
    comment text null,
    game_version_id uuid null,
    created_at timestamp without time zone null default current_timestamp,
    constraint interception_teams_pkey primary key (id),
    constraint interception_teams_boss_id_fkey foreign key (boss_id) references bosses (id) on delete cascade,
    constraint interception_teams_game_version_id_fkey foreign key (game_version_id) references game_versions (id) on delete set null,
    constraint interception_teams_mode_id_fkey foreign key (mode_id) references modes (id) on delete cascade,
    constraint interception_teams_user_id_fkey foreign key (user_id) references profiles (id) on delete cascade
  ) tablespace pg_default;


  create table
  public.modes (
    id uuid not null default extensions.uuid_generate_v4 (),
    name character varying(255) not null,
    description text null,
    constraint modes_pkey primary key (id)
  ) tablespace pg_default;


  create table
  public.nikkes (
    id uuid not null default extensions.uuid_generate_v4 (),
    name character varying(255) not null,
    slug character varying(255) not null,
    icon_url text not null,
    full_image_url text not null,
    rarity character varying(50) not null,
    element character varying(50) not null,
    weapon_type character varying(50) not null,
    burst character varying(10) not null,
    manufacturer character varying(255) not null,
    constraint nikkes_pkey primary key (id),
    constraint nikkes_slug_key unique (slug)
  ) tablespace pg_default;

  create table
  public.profiles (
    id uuid not null,
    username character varying(255) null,
    avatar_url text null,
    is_admin boolean null default false,
    constraint profiles_pkey primary key (id),
    constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete cascade
  ) tablespace pg_default;

  create table
  public.short_urls (
    id uuid not null default extensions.uuid_generate_v4 (),
    short_code character varying(10) not null,
    team_id uuid not null,
    mode character varying(50) not null,
    created_at timestamp without time zone null default current_timestamp,
    constraint short_urls_pkey primary key (id),
    constraint short_urls_short_code_key unique (short_code)
  ) tablespace pg_default;

  create table
  public.special_arena_teams (
    id uuid not null default extensions.uuid_generate_v4 (),
    user_id uuid null,
    attack_team_ids uuid[] not null,
    defense_team_ids uuid[] not null,
    created_at timestamp without time zone null default current_timestamp,
    constraint special_arena_teams_pkey primary key (id),
    constraint special_arena_teams_user_id_fkey foreign key (user_id) references profiles (id) on delete cascade
  ) tablespace pg_default;

  create table
  public.team_nikkes (
    id uuid not null default extensions.uuid_generate_v4 (),
    team_id uuid null,
    nikke_id uuid null,
    position integer not null,
    constraint team_nikkes_pkey primary key (id),
    constraint team_nikkes_nikke_id_fkey foreign key (nikke_id) references nikkes (id) on delete cascade,
    constraint team_nikkes_team_id_fkey foreign key (team_id) references teams (id) on delete cascade,
    constraint team_nikkes_position_check check (
      (
        ("position" >= 1)
        and ("position" <= 5)
      )
    )
  ) tablespace pg_default;

  create table
  public.teams (
    id uuid not null default extensions.uuid_generate_v4 (),
    user_id uuid null,
    mode_id uuid null,
    comment text null,
    created_at timestamp without time zone null default current_timestamp,
    game_version_id uuid null,
    constraint teams_pkey primary key (id),
    constraint teams_game_version_id_fkey foreign key (game_version_id) references game_versions (id) on delete set null,
    constraint teams_mode_id_fkey foreign key (mode_id) references modes (id) on delete cascade,
    constraint teams_user_id_fkey foreign key (user_id) references profiles (id) on delete cascade
  ) tablespace pg_default;

  create table
  public.tower_levels (
    id uuid not null default extensions.uuid_generate_v4 (),
    name character varying(255) not null,
    level integer not null,
    manufacturer character varying(255) null,
    mode_id uuid null,
    constraint tower_levels_pkey primary key (id),
    constraint tower_levels_name_level_key unique (name, level),
    constraint tower_levels_mode_id_fkey foreign key (mode_id) references modes (id) on delete cascade
  ) tablespace pg_default;


  create table
  public.tribe_tower_team_nikkes (
    id uuid not null default extensions.uuid_generate_v4 (),
    team_id uuid null,
    nikke_id uuid null,
    position integer not null,
    constraint tribe_tower_team_nikkes_pkey primary key (id),
    constraint tribe_tower_team_nikkes_nikke_id_fkey foreign key (nikke_id) references nikkes (id) on delete cascade,
    constraint tribe_tower_team_nikkes_team_id_fkey foreign key (team_id) references tribe_tower_teams (id) on delete cascade,
    constraint tribe_tower_team_nikkes_position_check check (
      (
        ("position" >= 1)
        and ("position" <= 5)
      )
    )
  ) tablespace pg_default;


  create table
  public.tribe_tower_teams (
    id uuid not null default extensions.uuid_generate_v4 (),
    user_id uuid null,
    tower_id uuid null,
    floor integer not null,
    comment text null,
    game_version_id uuid null,
    created_at timestamp without time zone null default current_timestamp,
    constraint tribe_tower_teams_pkey primary key (id),
    constraint tribe_tower_teams_game_version_id_fkey foreign key (game_version_id) references game_versions (id) on delete set null,
    constraint tribe_tower_teams_tower_id_fkey foreign key (tower_id) references tribe_towers (id) on delete cascade,
    constraint tribe_tower_teams_user_id_fkey foreign key (user_id) references profiles (id) on delete cascade
  ) tablespace pg_default;

create trigger tower_reset_trigger
after insert
or
update on tribe_tower_teams for each statement
execute function check_tower_reset ();


create table
  public.tribe_towers (
    id uuid not null default extensions.uuid_generate_v4 (),
    name character varying(255) not null,
    manufacturer character varying(255) null,
    max_floors integer not null,
    available_days character varying(255) [] not null,
    is_always_available boolean not null default false,
    reset_hour time with time zone not null default '16:00:00'::time without time zone,
    reset_day integer null,
    constraint tribe_towers_pkey primary key (id)
  ) tablespace pg_default;

  create table
  public.votes (
    id uuid not null default extensions.uuid_generate_v4 (),
    user_id uuid null,
    team_id uuid null,
    vote integer not null,
    created_at timestamp without time zone null default current_timestamp,
    constraint votes_pkey primary key (id),
    constraint votes_user_id_team_id_key unique (user_id, team_id),
    constraint votes_team_id_fkey foreign key (team_id) references teams (id) on delete cascade,
    constraint votes_user_id_fkey foreign key (user_id) references profiles (id) on delete cascade,
    constraint votes_vote_check check ((vote = any (array[1, '-1'::integer])))
  ) tablespace pg_default;