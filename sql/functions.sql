2-- Function for submitting a story team
CREATE OR REPLACE FUNCTION submit_story_team(
  p_user_id UUID,
  p_mode_id UUID,
  p_chapter_id UUID,
  p_game_version_id UUID,
  p_comment TEXT,
  p_nikkes JSON
) RETURNS JSON AS $$
DECLARE
  v_team_id UUID;
  v_nikke JSON;
BEGIN
  -- Insert the team
  INSERT INTO teams (user_id, mode_id, comment, game_version_id)
  VALUES (p_user_id, p_mode_id, p_comment, p_game_version_id)
  RETURNING id INTO v_team_id;

  -- Insert the relation with the chapter
  INSERT INTO chapter_teams (chapter_id, team_id)
  VALUES (p_chapter_id, v_team_id);

  -- Insert the Nikkes of the team
  FOR v_nikke IN SELECT * FROM json_array_elements(p_nikkes)
  LOOP
    INSERT INTO team_nikkes (team_id, nikke_id, position)
    VALUES (v_team_id, (v_nikke->>'id')::UUID, (v_nikke->>'position')::INTEGER);
  END LOOP;

  RETURN json_build_object('team_id', v_team_id);
END;
$$ LANGUAGE plpgsql;

-- Function for submitting a tribe tower team
CREATE OR REPLACE FUNCTION submit_tribe_tower_team(
  p_user_id UUID,
  p_tower_id UUID,
  p_floor INTEGER,
  p_game_version_id UUID,
  p_comment TEXT,
  p_nikkes JSON
) RETURNS JSON AS $$
DECLARE
  v_team_id UUID;
  v_nikke JSON;
BEGIN
  -- Insert the tribe tower team
  INSERT INTO tribe_tower_teams (user_id, tower_id, floor, comment, game_version_id)
  VALUES (p_user_id, p_tower_id, p_floor, p_comment, p_game_version_id)
  RETURNING id INTO v_team_id;

  -- Insert the Nikkes of the team
  FOR v_nikke IN SELECT * FROM json_array_elements(p_nikkes)
  LOOP
    INSERT INTO tribe_tower_team_nikkes (team_id, nikke_id, position)
    VALUES (v_team_id, (v_nikke->>'id')::UUID, (v_nikke->>'position')::INTEGER);
  END LOOP;

  RETURN json_build_object('team_id', v_team_id);
END;
$$ LANGUAGE plpgsql;


-- Function for submitting an interception team
CREATE OR REPLACE FUNCTION submit_interception_team(
  p_user_id UUID,
  p_mode_id UUID,
  p_boss_id UUID,
  p_game_version_id UUID,
  p_comment TEXT,
  p_nikkes JSON
) RETURNS JSON AS $$
DECLARE
  v_team_id UUID;
  v_nikke JSON;
BEGIN
  -- Insert the interception team
  INSERT INTO interception_teams (user_id, mode_id, boss_id, comment, game_version_id)
  VALUES (p_user_id, p_mode_id, p_boss_id, p_comment, p_game_version_id)
  RETURNING id INTO v_team_id;

  -- Insert the Nikkes of the team
  FOR v_nikke IN SELECT * FROM json_array_elements(p_nikkes)
  LOOP
    INSERT INTO interception_team_nikkes (team_id, nikke_id, position)
    VALUES (v_team_id, (v_nikke->>'id')::UUID, (v_nikke->>'position')::INTEGER);
  END LOOP;

  RETURN json_build_object('team_id', v_team_id);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS BOOLEAN AS $$
  SELECT is_admin FROM profiles WHERE id = user_id
$$ STABLE LANGUAGE sql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION create_short_url_for_team(
  p_team_id UUID,
  p_mode VARCHAR(50)
) RETURNS TEXT AS $$
DECLARE
    v_short_code TEXT;
    v_team_exists BOOLEAN;
BEGIN
    -- First, check if a short code already exists for the given team and mode
    SELECT short_code INTO v_short_code 
    FROM short_urls 
    WHERE team_id = p_team_id AND mode = p_mode
    LIMIT 1;

    -- If a short code already exists, return it
    IF v_short_code IS NOT NULL THEN
        RETURN v_short_code;
    END IF;

    -- Determine if the team exists in the relevant table based on the mode
    CASE p_mode
        WHEN 'story' THEN
            EXECUTE 'SELECT EXISTS (SELECT 1 FROM chapter_teams WHERE team_id = $1)' INTO v_team_exists USING p_team_id;
        WHEN 'tribe_tower' THEN
            EXECUTE 'SELECT EXISTS (SELECT 1 FROM tribe_tower_teams WHERE id = $1)' INTO v_team_exists USING p_team_id;
        WHEN 'interception' THEN
            EXECUTE 'SELECT EXISTS (SELECT 1 FROM interception_teams WHERE id = $1)' INTO v_team_exists USING p_team_id;
        -- Add more modes as necessary
        ELSE
            RAISE EXCEPTION 'Invalid mode: %', p_mode;
    END CASE;

    -- If the team does not exist in the relevant table, raise an exception
    IF NOT v_team_exists THEN
        RAISE EXCEPTION 'Team ID % not found for mode %', p_team_id, p_mode;
    END IF;

    -- Generate a random short code of 8 characters if it doesn't exist
    v_short_code := substr(md5(random()::text), 1, 8);

    -- Ensure the short code is unique
    WHILE EXISTS (SELECT 1 FROM short_urls WHERE short_code = v_short_code) LOOP
        v_short_code := substr(md5(random()::text), 1, 8);
    END LOOP;

    -- Insert the short code into the short_urls table
    INSERT INTO short_urls (short_code, team_id, mode)
    VALUES (v_short_code, p_team_id, p_mode);

    -- Return the generated short code
    RETURN v_short_code;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_slug(text)
RETURNS text AS $$
BEGIN
    RETURN regexp_replace(lower($1), '[^a-z0-9]+', '-', 'g');
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION check_tower_reset()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM reset_towers();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_available_towers() 
RETURNS TABLE (
    id UUID,
    name TEXT,
    reset_hour TIME WITH TIME ZONE,
    available_days TEXT[]
) AS $$
DECLARE
    current_utc TIMESTAMP WITH TIME ZONE := NOW() AT TIME ZONE 'UTC';
    utc_day INTEGER := EXTRACT(DOW FROM current_utc);
    utc_time TIME WITH TIME ZONE := current_utc::TIME WITH TIME ZONE;
BEGIN
    RETURN QUERY
    SELECT *
    FROM tribe_towers
    WHERE is_always_available = true
    OR utc_day = 6  -- Saturday: all towers are available
    OR utc_day = 1  -- Monday: all manufacturer towers are available
    OR (
        CASE utc_day
            WHEN 0 THEN 'Sunday'
            WHEN 1 THEN 'Monday'
            WHEN 2 THEN 'Tuesday'
            WHEN 3 THEN 'Wednesday'
            WHEN 4 THEN 'Thursday'
            WHEN 5 THEN 'Friday'
            WHEN 6 THEN 'Saturday'
        END = ANY(available_days)
        AND (
            (utc_time >= reset_hour)
            OR
            (utc_day = (CASE
                            WHEN 'Sunday' = ANY(available_days) THEN 0
                            WHEN 'Monday' = ANY(available_days) THEN 1
                            WHEN 'Tuesday' = ANY(available_days) THEN 2
                            WHEN 'Wednesday' = ANY(available_days) THEN 3
                            WHEN 'Thursday' = ANY(available_days) THEN 4
                            WHEN 'Friday' = ANY(available_days) THEN 5
                            WHEN 'Saturday' = ANY(available_days) THEN 6
                        END + 1) % 7 AND utc_time < reset_hour)
        )
    );
END;
$$ LANGUAGE plpgsql;


-- Function for getting team details by short code
CREATE OR REPLACE FUNCTION get_team_details_by_short_code(
    p_short_code TEXT
) RETURNS JSONB AS $$
DECLARE
        v_team_id UUID;
        v_mode VARCHAR(50);
        v_team_details JSONB;
        v_nikkes JSONB;
        v_mode_specific JSONB;
        v_table_name VARCHAR(100);
BEGIN
        -- Step 1: Get team_id and mode from the short_urls table
        SELECT team_id, mode INTO v_team_id, v_mode
        FROM short_urls
        WHERE short_code = p_short_code;

        IF v_team_id IS NULL OR v_mode IS NULL THEN
                RAISE EXCEPTION 'No team found for the provided short code.';
        END IF;

        -- Determine the base table based on the mode
        v_table_name := CASE v_mode
                WHEN 'story' THEN 'chapter_teams'
                WHEN 'tribe_tower' THEN 'tribe_tower_teams'
                WHEN 'interception' THEN 'interception_teams'
                ELSE NULL
        END CASE;

        -- Validate if a valid mode was found
        IF v_table_name IS NULL THEN
                RAISE EXCEPTION 'Unknown mode: %', v_mode;
        END IF;

        -- Step 2: Fetch base team details
        EXECUTE format('
                SELECT jsonb_build_object(
                        ''id'', t.id,
                        ''user_id'', t.user_id,
                        ''username'', p.username,
                        ''avatar_url'', p.avatar_url,
                        ''created_at'', t.created_at,
                        ''mode'', %L,
                        ''comment'', t.comment,
                        ''total_votes'', (SELECT count(*) FROM votes WHERE team_id = t.id)
                )::jsonb
                FROM %I t
                JOIN profiles p ON t.user_id = p.id
                WHERE t.id = %L',
                v_mode, v_table_name, v_team_id
        ) INTO v_team_details;

        -- Step 3: Fetch Nikkes associated with the team
        EXECUTE format('
                SELECT jsonb_agg(jsonb_build_object(
                        ''nikke_id'', n.id,
                        ''name'', n.name,
                        ''icon_url'', n.icon_url,
                        ''rarity'', n.rarity,
                        ''position'', tn.position
                ))::jsonb
                FROM %I tn
                JOIN nikkes n ON tn.nikke_id = n.id
                WHERE tn.team_id = %L',
                v_mode || '_team_nikkes', v_team_id
        ) INTO v_nikkes;

        -- Add the nikkes data to the team details
        v_team_details := jsonb_set(v_team_details, '{nikkes}', COALESCE(v_nikkes, '[]'::jsonb));

        -- Step 4: Add mode-specific details
        CASE v_mode
                WHEN 'story' THEN
                        EXECUTE format('
                                SELECT jsonb_build_object(
                                        ''chapter_number'', c.chapter_number,
                                        ''difficulty'', c.difficulty
                                )::jsonb
                                FROM chapter_teams ct
                                JOIN chapters c ON ct.chapter_id = c.id
                                WHERE ct.team_id = %L',
                                v_team_id
                        ) INTO v_mode_specific;

                WHEN 'tribe_tower' THEN
                        EXECUTE format('
                                SELECT jsonb_build_object(
                                        ''tower_name'', tt.name,
                                        ''floor'', tt_team.floor
                                )::jsonb
                                FROM tribe_tower_teams tt_team
                                JOIN tribe_towers tt ON tt_team.tower_id = tt.id
                                WHERE tt_team.id = %L',
                                v_team_id
                        ) INTO v_mode_specific;

                WHEN 'interception' THEN
                        EXECUTE format('
                                SELECT jsonb_build_object(
                                        ''boss_name'', b.name,
                                        ''boss_element'', b.element
                                )::jsonb
                                FROM interception_teams it
                                JOIN bosses b ON it.boss_id = b.id
                                WHERE it.id = %L',
                                v_team_id
                        ) INTO v_mode_specific;

                ELSE
                        v_mode_specific := NULL;
        END CASE;

        -- Add mode-specific details to the team details
        IF v_mode_specific IS NOT NULL THEN
                v_team_details := v_team_details || v_mode_specific;
        END IF;

        RETURN v_team_details::jsonb;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, avatar_url)
    VALUES (NEW.id, NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'avatar_url')
    ON CONFLICT (id) DO UPDATE
    SET username = EXCLUDED.username,
            avatar_url = EXCLUDED.avatar_url;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;




