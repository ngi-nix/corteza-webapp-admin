{
  inputs.dream2nix.url = "github:nix-community/dream2nix";
  outputs = inp:
    let
      system = "x86_64-linux";
      pkgs = inp.dream2nix.inputs.nixpkgs.legacyPackages.${system};
    in
    inp.dream2nix.lib.makeFlakeOutputs {
      systems = [ system ];
      config.projectRoot = ./.;
      source = ./.;

      # configure package builds via overrides
      # (see docs for override system below)
      packageOverrides = {
        # name of the package
        corteza-webapp-admin = {
          # name the override
          add-pre-build-steps = {
            # update attributes
            buildInputs = old: old ++ [ pkgs.git ];
          };
        };
      };
    };
}
