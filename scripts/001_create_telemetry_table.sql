-- Create telemetry_data table to store rocket mission data
CREATE TABLE IF NOT EXISTS public.telemetry_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  altitude DOUBLE PRECISION NOT NULL,
  velocity DOUBLE PRECISION NOT NULL,
  acceleration DOUBLE PRECISION NOT NULL,
  temperature DOUBLE PRECISION,
  pressure DOUBLE PRECISION,
  battery_voltage DOUBLE PRECISION,
  signal_strength DOUBLE PRECISION,
  gps_lat DOUBLE PRECISION,
  gps_lng DOUBLE PRECISION,
  gyro_x DOUBLE PRECISION,
  gyro_y DOUBLE PRECISION,
  gyro_z DOUBLE PRECISION,
  accel_x DOUBLE PRECISION,
  accel_y DOUBLE PRECISION,
  accel_z DOUBLE PRECISION,
  flight_phase TEXT,
  pyro_main BOOLEAN DEFAULT FALSE,
  pyro_drogue BOOLEAN DEFAULT FALSE,
  pyro_airbrakes BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create missions table to group telemetry data
CREATE TABLE IF NOT EXISTS public.missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_telemetry_mission_id ON public.telemetry_data(mission_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_timestamp ON public.telemetry_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_missions_status ON public.missions(status);

-- Enable Row Level Security
ALTER TABLE public.telemetry_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your auth setup)
CREATE POLICY "Allow public read access to telemetry_data" 
  ON public.telemetry_data FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert to telemetry_data" 
  ON public.telemetry_data FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public read access to missions" 
  ON public.missions FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert to missions" 
  ON public.missions FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update to missions" 
  ON public.missions FOR UPDATE 
  USING (true);
