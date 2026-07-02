-- TalinoTinig — PostgreSQL schema. Safe to re-run.

CREATE TABLE IF NOT EXISTS children (
    id                BIGSERIAL PRIMARY KEY,
    full_name         VARCHAR(150) NOT NULL,
    date_of_birth     DATE,
    guardian_name     VARCHAR(150),
    guardian_contact  VARCHAR(50),
    notes             TEXT,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMP,
    updated_at        TIMESTAMP
);

CREATE TABLE IF NOT EXISTS therapists (
    id              BIGSERIAL PRIMARY KEY,
    full_name       VARCHAR(150) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    license_number  VARCHAR(60),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP,
    updated_at      TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exercises (
    id                BIGSERIAL PRIMARY KEY,
    target_word       VARCHAR(120) NOT NULL,
    phoneme_focus     VARCHAR(60),
    category          VARCHAR(60),
    difficulty        SMALLINT NOT NULL DEFAULT 1,
    instructions      TEXT,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    level1_prompt     VARCHAR(255),
    level1_text       VARCHAR(120),
    level1_image_url  VARCHAR(512),
    level2_prompt     VARCHAR(255),
    level2_text       VARCHAR(255),
    level2_image_url  VARCHAR(512),
    level3_prompt     VARCHAR(255),
    level3_text       VARCHAR(255),
    level3_image_url  VARCHAR(512),
    media_url         VARCHAR(512),
    native_word       VARCHAR(255),
    created_at        TIMESTAMP,
    updated_at        TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    id            BIGSERIAL PRIMARY KEY,
    child_id      BIGINT NOT NULL,
    therapist_id  BIGINT,
    status        VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    started_at    TIMESTAMP,
    completed_at  TIMESTAMP,
    total_score   NUMERIC(5,2),
    notes         TEXT,
    created_at    TIMESTAMP,
    updated_at    TIMESTAMP
);

CREATE TABLE IF NOT EXISTS session_exercises (
    id              BIGSERIAL PRIMARY KEY,
    session_id      BIGINT NOT NULL,
    exercise_id     BIGINT NOT NULL,
    sequence_order  SMALLINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_se_session  FOREIGN KEY (session_id)  REFERENCES sessions (id),
    CONSTRAINT fk_se_exercise FOREIGN KEY (exercise_id) REFERENCES exercises (id),
    CONSTRAINT uq_session_exercise UNIQUE (session_id, exercise_id)
);

CREATE TABLE IF NOT EXISTS attempts (
    id                     BIGSERIAL PRIMARY KEY,
    session_id             BIGINT NOT NULL,
    exercise_id            BIGINT NOT NULL,
    attempt_number         SMALLINT NOT NULL DEFAULT 1,
    audio_url              VARCHAR(512),
    transcript             TEXT,
    accuracy_score         NUMERIC(5,2),
    ai_feedback            TEXT,
    ai_feedback_audio_url  VARCHAR(512),
    passed                 BOOLEAN,
    recorded_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    evaluated_at           TIMESTAMP,
    created_at             TIMESTAMP,
    updated_at             TIMESTAMP,
    CONSTRAINT fk_attempt_session  FOREIGN KEY (session_id)  REFERENCES sessions (id),
    CONSTRAINT fk_attempt_exercise FOREIGN KEY (exercise_id) REFERENCES exercises (id)
);

CREATE INDEX IF NOT EXISTS idx_attempts_session_exercise
    ON attempts (session_id, exercise_id);